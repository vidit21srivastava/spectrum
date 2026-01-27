import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {

    await requireAuth();

    const params = await credentialsParamsLoader(searchParams);
    prefetchCredentials(params);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<p>Error</p>}>
                <Suspense fallback={<p>Loading...</p>}>
                    {/* <CredentialList/> */}
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    );
};

export default Page;