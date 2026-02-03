import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Page = () => {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Account deleted</CardTitle>
                    <CardDescription>
                        Your account and data have been removed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-center text-sm text-muted-foreground">
                        If this was a mistake, you can create a new account any time.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/signup">Create a new account</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
