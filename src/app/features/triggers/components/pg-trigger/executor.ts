import type { NodeExecutor } from "@/app/features/executions/types";
import { paymentTriggerChannel } from "@/inngest/channels/payment-trigger";

type PaymentTriggerData = Record<string, unknown>;

export const paymentTriggerExecutor: NodeExecutor<PaymentTriggerData> = async (
    {
        // data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        paymentTriggerChannel().status({
            nodeID,
            status: "loading"
        })
    );

    const result = await step.run("google-form-trigger", async () => context);

    await publish(
        paymentTriggerChannel().status({
            nodeID,
            status: "success"
        })
    );
    return result;
};