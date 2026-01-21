"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { paypalTriggerChannel } from "@/inngest/channels/paypal-trigger";

export type PayPalTriggerToken = Realtime.Token<
    typeof paypalTriggerChannel,
    ["status"]
>;

export async function fetchPayPalTriggerRealtimeToken(): Promise<PayPalTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: paypalTriggerChannel(),
        topics: ["status"],
    });

    return token;
};