import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";
import { useExecuteWorkflow, useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";

export const ExecuteWorkflowButton = ({ workflowID }:
    { workflowID: string; }
) => {

    const editor = useAtomValue(editorAtom);
    const saveWorkflow = useUpdateWorkflow();

    const executeWorkflow = useExecuteWorkflow();

    const handleExecute = () => {

        if (!editor) {
            return;
        }

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow.mutate({
            id: workflowID,
            nodes,
            edges,
        },
            {
                onSuccess: () => {
                    executeWorkflow.mutate({ id: workflowID });
                }
            });


    };

    return (
        <Button size="sm" onClick={handleExecute} disabled={saveWorkflow.isPending || executeWorkflow.isPending}>
            <FlaskConicalIcon className="size-4" />
            Execute Workflow
        </Button>

    );
};
