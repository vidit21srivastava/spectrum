import { channel, topic } from "@inngest/realtime";

export const PAYMENT_TRIGGER_CHANNEL_NAME = "payment-trigger-execution";

export const paymentTriggerChannel = channel(PAYMENT_TRIGGER_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeID: string;
            status: "loading" | "success" | "error";
        }>(),
    );
