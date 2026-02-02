import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import Handlebars from "handlebars";
import { OpenAIFormValues } from "./dialog";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type OpenAIData = {
    variableName?: string;
    credentialID?: string;
    model?: OpenAIFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

export const OpenAIExecutor: NodeExecutor<OpenAIData> = async (
    {
        data,
        nodeID,
        userID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        openaiChannel().status({
            nodeID,
            status: "loading"
        })
    );

    if (!data.variableName) {
        await publish(
            openaiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("OpenAI node: Variable name is missing");
    }

    if (!data.userPrompt) {
        await publish(
            openaiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("OpenAI node: User prompt is missing");
    }

    if (!data.credentialID) {
        await publish(
            openaiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("OpenAI node: Credential is missing");
    }

    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialID,
                userId: userID,
            },
        })
    })

    if (!credential) {
        await publish(
            openaiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("OpenAI node: Credential not found");
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const openai = createOpenAI({
        apiKey: decrypt(credential.value),

    });

    try {
        const { steps } = await step.ai.wrap("openai-generate-text",
            generateText,
            {
                model: openai(data.model || "gpt-5"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },//sentry
            },
        );

        const text = steps[0].content[0].type === "text"
            ? steps[0].content[0].text
            : "";

        await publish(
            openaiChannel().status({
                nodeID,
                status: "success"
            })
        );


        return {
            ...context,
            [data.variableName]: {
                text,
            },
        };
    } catch (error) {
        await publish(
            openaiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw error;
    }

};