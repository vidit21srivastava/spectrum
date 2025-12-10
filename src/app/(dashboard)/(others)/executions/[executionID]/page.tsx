import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        executionID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { executionID } = await params;
    return (
        <p>Execution ID: {executionID} </p>
    );
};

export default Page;