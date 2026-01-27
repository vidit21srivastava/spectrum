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
import { useUpgradeModal } from "../../../hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import type { Credential } from "@/generated/prisma";
import { KeyRound } from "lucide-react";


export const CredentialsSearch = () => {

    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    })


    return (
        <EntitySearch value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Credentials"
        />
    );

};


export const CredentialsList = () => {
    // throw new Error("error test");

    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(crdential) => crdential.id}
            renderItem={(credential) => (<CredentialsItem data={credential} />)}
            emptyView={<CredentialsEmpty />}
        />
    );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <EntityHeader
            title="Credentials"
            description="Create and manage your credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled={disabled}
        />
    );
};

export const CredentialsPagination = () => {
    const [params, setParams] = useCredentialsParams();
    const credentials = useSuspenseCredentials();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    );

}


export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {

    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}>
            {children}
        </EntityContainer>
    );

}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />;
};

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials" />;
};

export const CredentialsEmpty = () => {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/credentials/new`);
    };

    return (
        <EmptyView onNew={handleCreate}
            message="No credentials found. Get started by creating your credential." />
    );
};

export const CredentialsItem = ({ data }: { data: Credential }) => {

    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({ id: data.id })
    }

    return (
        <EntityItem
            href={`/crdentials/${data.id}`}
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
                    <KeyRound className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    );
};