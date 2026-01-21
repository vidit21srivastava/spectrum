import { channel, topic } from "@inngest/realtime";

export const PAYPAL_TRIGGER_CHANNEL_NAME = "paypal-trigger-execution";

export const paypalTriggerChannel = channel(PAYPAL_TRIGGER_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeID: string;
            status: "loading" | "success" | "error";
        }>(),
    );
