import type { NodeExecutor } from "@/app/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { googleGeminiChannel } from "@/inngest/channels/google-gemini";
import { GoogleGeminiFormValues } from "./dialog";

Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type googleGeminiData = {
    variableName?: string;
    model?: GoogleGeminiFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

export const googleGeminiExecutor: NodeExecutor<googleGeminiData> = async (
    {
        data,
        nodeID,
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

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey: credValue,
    });


};