import { channel, topic } from "@inngest/realtime";

export const httpRequestChannel = channel("http-request-execution")
    .addTopic(
        topic("status").type<{
            nodeID: string;
            stattus: "loading" | "success" | "error";
        }>(),
    );
