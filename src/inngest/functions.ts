import { NonRetriableError, step } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { paymentTriggerChannel } from "./channels/payment-trigger";
import { paypalTriggerChannel } from "./channels/paypal-trigger";
import { googleGeminiChannel } from "./channels/google-gemini";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";


export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: process.env.NODE_ENV === "production" ? 1 : 0,
        onFailure: async ({ event }) => {
            return prisma.execution.update({
                where: { inngestEventID: event.data.event.id },
                data: {
                    status: ExecutionStatus.FAILED,
                    error: event.data.error.message,
                    errorStack: event.data.error.stack
                },
            });
        }
    },
    {
        event: "workflows/execute.workflow",
        channels: [
            httpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            paymentTriggerChannel(),
            paypalTriggerChannel(),
            googleGeminiChannel(),
            openaiChannel(),
            anthropicChannel(),
            discordChannel(),
            slackChannel(),
        ]
    },
    async ({ event, step, publish }) => {

        const inngestEventID = event.id;

        const workflowID = event.data.workflowID;
        if (!inngestEventID || !workflowID) {
            throw new NonRetriableError("Event ID or Workflow ID is missing");
        }

        await step.run("create-execution-history", async () => {
            return prisma.execution.create({
                data: {
                    workflowID,
                    inngestEventID,
                },
            });
        });

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

        const userID = await step.run("find-user-id", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowID,
                },
                select: {
                    userId: true,
                }
            });

            return workflow.userId;
        })
        // Initializing the context with any initial data  from the trigger.

        let context = event.data.initialData || {};

        for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType); //->executor registry
            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeID: node.id,
                userID,
                context,
                step,
                publish,
            })
        }

        await step.run("update-execution-history", async () => {
            return prisma.execution.update({
                where: { inngestEventID },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    completedAt: new Date(),
                    output: context,
                },
            });
        });

        return {
            workflowID,
            result: context,
        };
    },

);