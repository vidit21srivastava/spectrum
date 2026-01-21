import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/app/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFromTriggerExecutor } from "../../triggers/components/google-form-trigger/executor";
import { paymentTriggerExecutor } from "../../triggers/components/pg-trigger/executor";
import { paypalTriggerExecutor } from "../../triggers/components/paypal-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, // yet to fix types
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFromTriggerExecutor,
    [NodeType.PAYMENT_TRIGGER]: paymentTriggerExecutor,
    [NodeType.PAYPAL_TRIGGER]: paypalTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor for the node type: ${type}`)
    }

    return executor;
};