import { requireAuth } from "@/lib/auth-utils";
import { SearchParams } from "nuqs";

type Props = {
    searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {

    await requireAuth();
    return (
        <p>Credentials</p>
    );
};

export default Page;