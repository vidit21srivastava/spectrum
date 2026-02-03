"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        revokeOtherSessions: z.boolean(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;


interface AccountSettingsProps {
    user: {
        email: string;
        name?: string | null;
        image?: string | null;
    };
}

export function AccountSettings({ user }: AccountSettingsProps) {
    const router = useRouter();

    const changePasswordForm = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            revokeOtherSessions: true,
        },
    });

    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const handleChangePassword = async (values: ChangePasswordValues) => {
        await authClient.changePassword(
            {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                revokeOtherSessions: values.revokeOtherSessions,
            },
            {
                onSuccess: () => {
                    toast.success("Password updated.");
                    changePasswordForm.reset();
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            }
        );
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        await authClient.deleteUser(
            { callbackURL: "/goodbye" },
            {
                onSuccess: () => {
                    toast.success("Check your email to confirm account deletion.");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            }
        );
        setIsDeletingAccount(false);
    };

    const isChangingPassword = changePasswordForm.formState.isSubmitting;


    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                            <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email} />
                            <AvatarFallback>
                                {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{user.name ?? "Account"}</CardTitle>
                            <CardDescription>
                                Signed in as {user.email}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>
                        Update your password and optionally revoke other sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...changePasswordForm}>
                        <form onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}>
                            <div className="grid gap-4">
                                <FormField
                                    control={changePasswordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="*********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="*********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm new password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="*********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="revokeOtherSessions"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                                            <div className="space-y-1">
                                                <FormLabel>Revoke other sessions</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Sign out from other devices after updating your password.
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isChangingPassword}>
                                    Update password
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Delete account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. You will receive an email to confirm deletion.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button type="button" variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                                        Delete account
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
