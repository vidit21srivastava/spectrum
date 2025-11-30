import { SignUpForm } from "@/app/features/auth/components/signup-form"
import { requireUnauth } from "@/lib/auth-utils"

const Page = async () => {
    // await requireUnauth();
    return <SignUpForm />;


}

export default Page