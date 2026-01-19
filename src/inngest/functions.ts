import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/app/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";


export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: 0 // trial only
    },
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
        ]
    },
    async ({ event, step, publish }) => {

        const workflowID = event.data.workflowID;
        if (!workflowID) {
            throw new NonRetriableError("Workflow ID is missing");
        }

        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowID,
                },
                include: {
                    nodes: true,
                    connections: true,
                },
            });

            return topologicalSort(workflow.nodes, workflow.connections);
        });

        // Initializing the context with any initial data  from the trigger.

        let context = event.data.initialData || {};

        for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType); //->executor registry
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeID: node.id,
                context,
                step,
                publish,
            })
        }

        return {
            workflowID,
            result: context,
        };
    },

);