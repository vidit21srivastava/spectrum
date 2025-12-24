"use client";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "../../workflows/hooks/use-workflows";

export const EditorLoading = () => {
    return <LoadingView message="Loading..." />;
};

export const EditorError = () => {
    return <ErrorView message="Error loading editor." />;
};

export const Editor = ({ workflowID }: { workflowID: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowID);

    return (
        <p>
            {JSON.stringify(workflow, null, 2)}
        </p>
    )
}