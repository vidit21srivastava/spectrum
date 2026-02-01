import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { GoogleGeminiNode } from "@/features/executions/components/google-gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAINode } from "@/features/executions/components/openai/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { PayPalTriggerNode } from "@/features/triggers/components/paypal-trigger/node";
import { PaymentTriggerNode } from "@/features/triggers/components/pg-trigger/node";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";
import { DiscordNode } from "@/features/executions/components/discord/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.PAYMENT_TRIGGER]: PaymentTriggerNode,
    [NodeType.PAYPAL_TRIGGER]: PayPalTriggerNode,
    [NodeType.GOOGLE_GEMINI]: GoogleGeminiNode,
    [NodeType.OPENAI]: OpenAINode,
    [NodeType.ANTHROPIC]: AnthropicNode,
    [NodeType.DISCORD]: DiscordNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;