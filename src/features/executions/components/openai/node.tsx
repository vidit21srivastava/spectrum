"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AVAILABLE_MODELS, OpenAIDialog, OpenAIFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAIRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAINodeData = {
    variableName?: string;
    credentialID?: string;
    model?: OpenAIFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeID: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRealtimeToken,
    });

    // const nodeStatus = "loading";

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: OpenAIFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    }
                }
            }
            return node;
        }));
    };

    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not Configured";


    return (
        <>
            <OpenAIDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}

            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
            />
        </>
    );
});

OpenAINode.displayName = "OpenAINode";


