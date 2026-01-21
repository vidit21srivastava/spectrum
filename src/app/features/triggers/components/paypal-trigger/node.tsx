"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { PayPalTriggerDialog } from "./dialog";
import { fetchPayPalTriggerRealtimeToken } from "./actions";
import { useNodeStatus } from "@/app/features/executions/hooks/use-node-status";
import { PAYPAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/paypal-trigger";


export const PayPalTriggerNode = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeID: props.id,
        channel: PAYPAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchPayPalTriggerRealtimeToken,
    });



    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <PayPalTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                icon="/paypal.svg"
                name="PayPal"
                description="On 'Payment' event"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

PayPalTriggerNode.displayName = "PayPalTriggerNode";