import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
    await requireUnauth();
    return <ForgotPasswordForm />;
};

export default Page;
