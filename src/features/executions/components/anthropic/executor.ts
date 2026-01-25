import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { AnthropicFormValues } from "./dialog";
import { anthropicChannel } from "@/inngest/channels/anthropic";


Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type AnthropicData = {
    variableName?: string;
    model?: AnthropicFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async (
    {
        data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        anthropicChannel().status({
            nodeID,
            status: "loading"
        })
    );

    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Anthropic node: Variable name is missing");
    }

    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Anthropic node: User prompt is missing");
    }

    //TODO: cred missing?

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credValue,
    });

    try {
        const { steps } = await step.ai.wrap("anthropic-generate-text",
            generateText,
            {
                model: anthropic(data.model || "claude-sonnet-4-5-20250929"),
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
            anthropicChannel().status({
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
            anthropicChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw error;
    }

};