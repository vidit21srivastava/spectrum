import { Editor, EditorError, EditorLoading } from "@/app/features/editor/components/editor";
import { EditorHeader } from "@/app/features/editor/components/editor-header";
import { prefetchWorkflow } from "@/app/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{
        workflowID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { workflowID } = await params;
    prefetchWorkflow(workflowID);
    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />} >
                <Suspense fallback={<EditorLoading />}>
                    <EditorHeader workflowID={workflowID} />
                    <main className="flex-1">
                        <Editor workflowID={workflowID} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient >
    );
};

export default Page;