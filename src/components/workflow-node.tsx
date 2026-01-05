"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

export function WorkflowNode({
    children,
    showToolbar = true,
    onDelete,
    onSettings,
    name,
    description,
}: WorkflowNodeProps) {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button size="sm" variant="ghost" onClick={onSettings}>
                        <SettingsIcon className="size-4 text-muted-foreground" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onDelete}>
                        <TrashIcon className="size-4 text-muted-foreground" />
                    </Button>
                </NodeToolbar>
            )}
            {children}
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center group ">
                    <div className="font-medium text-xs">
                        {name}
                    </div>
                    {description && (
                        <div className="bg-gray-200 rounded-xl p-2 text-gray-600 text-xs hidden group-hover:block whitespace-normal wrap-break-word">
                            {description}
                        </div>
                    )}
                </NodeToolbar>
            )}
        </>
    );
};

