import { channel, topic } from "@inngest/realtime";

export const GOOGLE_GEMINI_CHANNEL_NAME = "google-gemini-execution";

export const googleGeminiChannel = channel(GOOGLE_GEMINI_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeID: string;
            status: "loading" | "success" | "error";
        }>(),
    );
