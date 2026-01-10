import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "../../triggers/components/manual-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor for the node type: ${type}`)
    }

    return executor;
};