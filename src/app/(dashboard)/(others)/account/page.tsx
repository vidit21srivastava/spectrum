import { AccountSettings } from "@/features/auth/components/account-settings";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    const session = await requireAuth();

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <AccountSettings
                user={{
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image,
                }}
            />
        </div>
    );
};

export default Page;
