"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow-ui/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelecorOpen] = useState(false);

    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelecorOpen}>
            <WorkflowNode>
                <PlaceholderNode
                    {...props}
                    onClick={() => setSelecorOpen(true)}
                >
                    <div className="cursor-pointer flex items-center justify-center">
                        <PlusIcon className="size-4" />
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    );
});

InitialNode.displayName = "InitialNode";