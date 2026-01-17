"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow-ui/base-node";
import { BaseHandle } from "@/components/react-flow-ui/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow-ui/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick,
        status = "initial",

    }: BaseTriggerNodeProps) => {

        const { setNodes, setEdges } = useReactFlow();

        const handleDelete = () => {
            setNodes((currentNodes) => {
                const updateNodes = currentNodes.filter((node) => node.id !== id)
                return updateNodes;
            });

            setEdges((currentEdges) => {
                const updateEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id)
                return updateEdges;
            });
        };

        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onSettings={onSettings}
            >
                <NodeStatusIndicator
                    status={status}
                    variant="border"
                    className="rounded-l-2xl"
                >
                    <BaseNode status={status} onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                        <BaseNodeContent>
                            {typeof Icon === "string" ? (
                                <Image
                                    className="size-4"
                                    src={Icon}
                                    alt={name}
                                    width={12}
                                    height={12}
                                />
                            ) : (
                                <Icon className="size-4 text-muted-foreground" />
                            )}
                            {children}

                            <BaseHandle
                                id="source-1"
                                type="source"
                                position={Position.Right}
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        );
    },
);

BaseTriggerNode.displayName = "BaseTriggerNode";