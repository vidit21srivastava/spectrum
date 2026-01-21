"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { PaymentTriggerDialog } from "./dialog";
import { fetchPaymentTriggerRealtimeToken } from "./actions";
import { useNodeStatus } from "@/app/features/executions/hooks/use-node-status";
import { PAYMENT_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/payment-trigger";


export const PaymentTriggerNode = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeID: props.id,
        channel: PAYMENT_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchPaymentTriggerRealtimeToken,
    });



    const handleOpenSettings = () => setDialogOpen(true);

    return (
        <>
            <PaymentTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                icon="/stripe.svg"
                name="Stripe"
                description="On 'Payment' event"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

PaymentTriggerNode.displayName = "PaymentTriggerNode";