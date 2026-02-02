import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { googleGeminiChannel } from "@/inngest/channels/google-gemini";
import { GoogleGeminiFormValues } from "./dialog";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type googleGeminiData = {
    variableName?: string;
    credentialID?: string;
    model?: GoogleGeminiFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

export const googleGeminiExecutor: NodeExecutor<googleGeminiData> = async (
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
        googleGeminiChannel().status({
            nodeID,
            status: "loading"
        })
    );

    if (!data.variableName) {
        await publish(
            googleGeminiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Gemini node: Variable name is missing");
    }

    if (!data.credentialID) {
        await publish(
            googleGeminiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Gemini node: Credential is missing");
    }

    if (!data.userPrompt) {
        await publish(
            googleGeminiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Gemini node: User prompt is missing");
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
            googleGeminiChannel().status({
                nodeID,
                status: "error"
            })
        );

        throw new NonRetriableError("Gemini node: Credential not found");
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);


    const google = createGoogleGenerativeAI({
        apiKey: decrypt(credential.value),
    });

    try {
        const { steps } = await step.ai.wrap("gemini-generate-text",
            generateText,
            {
                model: google(data.model || "gemini-2.5-flash-lite"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },//sentry
            },
        );

        const text = steps?.[0]?.content?.[0]?.type === "text" //defensive check
            ? steps[0].content[0].text
            : "";

        await publish(
            googleGeminiChannel().status({
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
            googleGeminiChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw error;
    }

};