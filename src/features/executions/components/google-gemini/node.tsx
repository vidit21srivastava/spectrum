"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AVAILABLE_MODELS, GoogleGeminiDialog, GoogleGeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGoogleGeminiRealtimeToken } from "./actions";
import { GOOGLE_GEMINI_CHANNEL_NAME } from "@/inngest/channels/google-gemini";

type GoogleGeminiNodeData = {
    variableName?: string;
    credentialID?: string;
    model?: GoogleGeminiFormValues["model"];
    systemPrompt?: string;
    userPrompt?: string;
};

type GoogleGeminiNodeType = Node<GoogleGeminiNodeData>;

export const GoogleGeminiNode = memo((props: NodeProps<GoogleGeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeID: props.id,
        channel: GOOGLE_GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleGeminiRealtimeToken,
    });

    // const nodeStatus = "loading";

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: GoogleGeminiFormValues) => {
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
            <GoogleGeminiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}

            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/gemini.svg"
                name="Gemini"
                status={nodeStatus}
                description={description}
                onDoubleClick={handleOpenSettings}
                onSettings={handleOpenSettings}
            />
        </>
    );
});

GoogleGeminiNode.displayName = "GoogleGeminiNode";


