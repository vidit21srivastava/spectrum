import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";


const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
    { id: "execute" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        const { steps } = await step.ai.wrap("gemini-generate-text",
            generateText, {
            model: google("gemini-2.5-flash"),
            system: "You are a helpful assistant.",
            prompt: "What is the half-life of radium?"
        }
        );
        return steps;
    },
);