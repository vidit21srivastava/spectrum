import { AnthropicNode } from "@/app/features/executions/components/anthropic/node";
import { GoogleGeminiNode } from "@/app/features/executions/components/google-gemini/node";
import { HttpRequestNode } from "@/app/features/executions/components/http-request/node";
import { OpenAINode } from "@/app/features/executions/components/openai/node";
import { GoogleFormTriggerNode } from "@/app/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/app/features/triggers/components/manual-trigger/node";
import { PayPalTriggerNode } from "@/app/features/triggers/components/paypal-trigger/node";
import { PaymentTriggerNode } from "@/app/features/triggers/components/pg-trigger/node";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

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
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;