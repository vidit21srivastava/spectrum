import type { NodeExecutor } from "@/app/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async (
    {
        // data,
        nodeID,
        context,
        step,
    }
) => {
    // TODO : Publish "loading" state for manual trigger

    const result = await step.run("manual-trigger", async () => context);

    //TODO: Publish "success" state for manual trigger
    return result;
};