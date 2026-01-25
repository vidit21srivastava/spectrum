import type { NodeExecutor } from "@/features/executions/types";
import { paypalTriggerChannel } from "@/inngest/channels/paypal-trigger";

type PayPalTriggerData = Record<string, unknown>;

export const paypalTriggerExecutor: NodeExecutor<PayPalTriggerData> = async (
    {
        // data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        paypalTriggerChannel().status({
            nodeID,
            status: "loading"
        })
    );

    const result = await step.run("paypal-trigger", async () => context);

    await publish(
        paypalTriggerChannel().status({
            nodeID,
            status: "success"
        })
    );
    return result;
};