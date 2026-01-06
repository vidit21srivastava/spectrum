import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";


export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow" },
    { event: "workflows/execute.workflow" },
    async ({ event, step }) => {

        const workflowID = event.data.workflowID;
        if (!workflowID) {
            throw new NonRetriableError("Workflow ID is missing");
        }

        const nodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowID,
                },
                include: {
                    nodes: true,
                    connections: true,
                },
            });

            return workflow.nodes;
        });

        return { nodes };
    },

);