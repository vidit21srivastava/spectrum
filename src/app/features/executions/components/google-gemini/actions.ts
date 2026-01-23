"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { googleGeminiChannel } from "@/inngest/channels/google-gemini";

export type GoogleGeminiToken = Realtime.Token<
    typeof googleGeminiChannel,
    ["status"]
>;

export async function fetchGoogleGeminiRealtimeToken(): Promise<GoogleGeminiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: googleGeminiChannel(),
        topics: ["status"],
    });

    return token;
};