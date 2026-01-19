"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { GoogleFormTriggerDialog } from "./dialog";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { useNodeStatus } from "@/app/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    // const nodeStatus = useNodeStatus({
    //     nodeID: props.id,
    //     channel: MANUAL_TRIGGER_CHANNEL_NAME,
    //     topic: "status",
    //     refreshToken: fetchManualTriggerRealtimeToken,
    // });

    const nodeStatus = "initial";

    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <GoogleFormTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                icon="/googleform.svg"
                name="Google Forms"
                description="On form 'Submission'"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";