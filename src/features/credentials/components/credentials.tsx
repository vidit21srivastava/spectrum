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
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useRemoveCredential, useSuspenseCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { type Credential, CredentialType } from "@/generated/prisma";
import { BookKey, KeyRound } from "lucide-react";
import Image from "next/image";
import { CredentialForm } from "./credential-form";


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
            getKey={(credential) => credential.id}
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
        <EmptyView icon={BookKey} title="No Credentials" newButtonLabel="Add Credential" onNew={handleCreate}
            message="No credentials found. Get started by creating your credential." />
    );
};

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GOOGLE_GEMINI]: "/gemini.svg",
}

export const CredentialsItem = ({ data }: { data: Credential }) => {

    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({ id: data.id })
    }

    const logo = credentialLogos[data.type] ?? KeyRound;

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
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
                    <Image src={logo} alt={data.type} width={20} height={20} />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    );
};

export const CredentialView = ({ credentialID }: { credentialID: string }) => {

    const { data: credential } = useSuspenseCredential(credentialID);

    return <CredentialForm initialData={credential} />;
}