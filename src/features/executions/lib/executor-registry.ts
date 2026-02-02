import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFromTriggerExecutor } from "../../triggers/components/google-form-trigger/executor";
import { paymentTriggerExecutor } from "../../triggers/components/pg-trigger/executor";
import { paypalTriggerExecutor } from "../../triggers/components/paypal-trigger/executor";
import { googleGeminiExecutor } from "../components/google-gemini/executor";
import { OpenAIExecutor } from "../components/openai/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { DiscordExecutor } from "../components/discord/executor";
import { SlackExecutor } from "../components/slack/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, // yet to fix types
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFromTriggerExecutor,
    [NodeType.PAYMENT_TRIGGER]: paymentTriggerExecutor,
    [NodeType.PAYPAL_TRIGGER]: paypalTriggerExecutor,
    [NodeType.GOOGLE_GEMINI]: googleGeminiExecutor,
    [NodeType.ANTHROPIC]: anthropicExecutor,
    [NodeType.OPENAI]: OpenAIExecutor,
    [NodeType.DISCORD]: DiscordExecutor,
    [NodeType.SLACK]: SlackExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor for the node type: ${type}`)
    }

    return executor;
};