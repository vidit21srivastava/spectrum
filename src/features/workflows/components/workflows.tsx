"use client";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityList,
    EntityPagination,
    EntitySearch,
    ErrorView,
    LoadingView
} from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { PackageOpenIcon, WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";


export const WorkflowsSearch = () => {

    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    })


    return (
        <EntitySearch value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Workflows"
        />
    );

};


export const WorkflowsList = () => {
    // throw new Error("error test");

    const workflows = useSuspenseWorkflows();

    // if (workflows.data.items.length === 0) {
    //     return (
    //         <WorkflowsEmpty />
    //     );
    // };

    // return (
    //     <div className="flex-1 flex justify-center items-center">
    //         <p>
    //             {JSON.stringify(workflows.data, null, 2)}
    //         </p>
    //     </div>
    // );

    return (
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => (<WorkflowsItem data={workflow} />)}
            emptyView={<WorkflowsEmpty />}
        />
    );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);

            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };



    return (
        <EntityHeader
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New Workflow"
            disabled={disabled}
            isCreating={createWorkflow.isPending} />
    );
};

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams();
    const workflows = useSuspenseWorkflows();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );

}


export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {

    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}>
            {children}
        </EntityContainer>
    );

}

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..." />;
};

export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows" />;
};

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                toast.error(error.message);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            }
        });
    };

    return (
        <EmptyView icon={PackageOpenIcon} title="No Workflows" newButtonLabel="Add Workflow" onNew={handleCreate}
            message="No workflows found. Get started by creating your workflow." />
    );
};

export const WorkflowsItem = ({ data }: { data: Workflow }) => {

    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id })
    }

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                //TODO
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    );
};