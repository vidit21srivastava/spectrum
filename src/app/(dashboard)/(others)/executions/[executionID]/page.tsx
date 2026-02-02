import { ExecutionLog } from "@/features/executions/components/execution-log";
import { ExecutionsError, ExecutionsLoading } from "@/features/executions/components/executions";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{
        executionID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { executionID } = await params;

    prefetchExecution(executionID);
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-5xl w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<ExecutionsError />}>
                        <Suspense fallback={<ExecutionsLoading />}>
                            <ExecutionLog executionID={executionID} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>

    );
};

export default Page;