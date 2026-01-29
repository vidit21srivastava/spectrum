import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        credentialID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { credentialID } = await params;
    return (
        <p>Credential ID: {credentialID} </p>
    );
};

export default Page;