import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow-ui/node-status-indicator";

interface useNodeStatusOptions {
    nodeID: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
};

export function useNodeStatus({
    nodeID,
    channel,
    topic,
    refreshToken
}: useNodeStatusOptions) {

    const [status, setStatus] = useState<NodeStatus>("initial");

    const { data } = useInngestSubscription({
        refreshToken,
        enabled: true,
    });

    useEffect(() => {
        if (!data?.length) {
            return;
        };

        //Find latest msg for this node

        const latestMessage = data
            .filter(
                (msg) => msg.kind === "data"
                    && msg.channel === channel
                    && msg.topic === topic
                    && msg.data.nodeID === nodeID
            )
            .sort(
                (a, b) => {
                    if (a.kind === "data" && b.kind === "data") {
                        return (
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                    }
                    return 0;
                }
            )[0]; // first index of the array returned

        if (latestMessage?.kind === "data") {
            setStatus(latestMessage.data.status as NodeStatus);
        };

    }, [data, nodeID, channel, topic]);

    return status;
};