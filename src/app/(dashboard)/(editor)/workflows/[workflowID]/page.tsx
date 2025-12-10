import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        workflowID: string;
    }>
};
const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { workflowID } = await params;
    return (
        <p>Workflow ID: {workflowID} </p>
    );
};

export default Page;