import type { NodeExecutor } from "@/app/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFromTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async (
    {
        // data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        googleFormTriggerChannel().status({
            nodeID,
            status: "loading"
        })
    );

    const result = await step.run("google-form-trigger", async () => context);

    await publish(
        googleFormTriggerChannel().status({
            nodeID,
            status: "success"
        })
    );
    return result;
};