"use client";

import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityList,
    EntityPagination,
    ErrorView,
    LoadingView
} from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { CircleAlert, CircleCheck, ClockFading, History, RefreshCw, } from "lucide-react";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { Execution, ExecutionStatus } from "@/generated/prisma";


export const ExecutionsList = () => {
    // throw new Error("error test");

    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => (<ExecutionsItem data={execution} />)}
            emptyView={<ExecutionsEmpty />}
        />
    );
};

export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Executions"
            description="View your workflow execution history"

        />
    );
};

export const ExecutionsPagination = () => {
    const [params, setParams] = useExecutionsParams();
    const executions = useSuspenseExecutions();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );

}


export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {

    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}>
            {children}
        </EntityContainer>
    );

}

export const ExecutionsLoading = () => {
    return <LoadingView message="Loading executions..." />;
};

export const ExecutionsError = () => {
    return <ErrorView message="Error loading executions" />;
};

export const ExecutionsEmpty = () => {

    return (
        <EmptyView icon={History} title="No executions"
            message="No executions found. Get started by running your first workflow." />
    );
};

export const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CircleCheck className="size-6 text-green-600/60" />;
        case ExecutionStatus.FAILED:
            return <CircleAlert className="size-6 text-red-600/50" />;
        case ExecutionStatus.RUNNING:
            return <RefreshCw className="size-6 text-blue-600/50 animate-spin" />
        default:
            return <ClockFading className="size-6 text-muted-foreground" />;;

    }
};

export const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
}


export const ExecutionsItem = ({ data }: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        };
    };
}) => {

    const duration = data.completedAt
        ? Math.round(
            (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000)
        : null;

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatStatus(data.status)}
            subtitle={
                <>
                    {data.workflow.name} &bull; Started{" "}
                    {formatDistanceToNow(data.startedAt, { addSuffix: true })}
                    {duration !== null && <>{" "}&bull; Took {duration}s</>}
                </>
            }
            image={
                //TODO
                <div className="size-8 flex items-center justify-center">
                    {getStatusIcon(data.status)}
                </div>
            }
        />
    );
};

// export const ExecutionView = ({ executionID }: { executionID: string }) => {

//     const { data: execution } = useSuspenseExecution(executionID);

//     return <ExecutionForm initialData={execution} />;
// }