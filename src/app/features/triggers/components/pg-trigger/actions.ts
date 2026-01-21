"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { paymentTriggerChannel } from "@/inngest/channels/payment-trigger";

export type PaymentTriggerToken = Realtime.Token<
    typeof paymentTriggerChannel,
    ["status"]
>;

export async function fetchPaymentTriggerRealtimeToken(): Promise<PaymentTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: paymentTriggerChannel(),
        topics: ["status"],
    });

    return token;
};