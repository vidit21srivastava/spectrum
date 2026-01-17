import type { NodeExecutor } from "@/app/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async (
    {
        // data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        manualTriggerChannel().status({
            nodeID,
            status: "loading"
        })
    );

    const result = await step.run("manual-trigger", async () => context);

    await publish(
        manualTriggerChannel().status({
            nodeID,
            status: "success"
        })
    );
    return result;
};