import { channel, topic } from "@inngest/realtime";

export const SLACK_CHANNEL_NAME = "slack-execution";

export const slackChannel = channel(SLACK_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeID: string;
            status: "loading" | "success" | "error";
        }>(),
    );
