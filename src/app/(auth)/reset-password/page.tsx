import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
    await requireUnauth();
    return (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default Page;
