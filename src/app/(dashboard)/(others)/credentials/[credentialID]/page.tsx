import { CredentialsError, CredentialsLoading, CredentialView } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface PageProps {
    params: Promise<{
        credentialID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { credentialID } = await params;

    prefetchCredential(credentialID);
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
                <HydrateClient>
                    <ErrorBoundary fallback={<CredentialsError />}>
                        <Suspense fallback={<CredentialsLoading />}>
                            <CredentialView credentialID={credentialID} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>

    );
};

export default Page;