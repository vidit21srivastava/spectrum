"use client";

import { CredentialType } from "@/generated/prisma";

import { useCreateCredential, useUpdateCredential } from "../hooks/use-credentials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CredentialTypeOptions = [
    {
        value: CredentialType.OPENAI,
        label: "OpenAI",
        logo: "/openai.svg"
    },
    {
        value: CredentialType.ANTHROPIC,
        label: "Anthropic",
        logo: "/anthropic.svg"
    },
    {
        value: CredentialType.GOOGLE_GEMINI,
        label: "Gemini",
        logo: "/gemini.svg"
    },
]

interface CredentialFormProps {

    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    }
}

export const CredentialForm = ({
    initialData,
}: CredentialFormProps) => {

    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        }
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            })
        } else {
            await createCredential.mutateAsync(values, {
                onError: (error) => {
                    toast.error(error.message);
                }
            })
        }
    }

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Credential" : "Create Credential"}
                </CardTitle>
                <CardDescription className="mb-6">
                    {isEdit
                        ? "Update your API key or credential details"
                        : "Add a new API key or credential to your account"}
                </CardDescription>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Credential Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CredentialTypeOptions.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src={option.logo}
                                                                    alt={option.label}
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>API Key</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="sk&mdash;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;&#8727;" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                            />
                            <CardFooter className="flex gap-4 ">
                                <Button type="submit"
                                    disabled={createCredential.isPending || updateCredential.isPending}>
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                                <Button type="button" variant="outline"
                                    asChild>
                                    <Link href="/credentials" prefetch>
                                        Cancel
                                    </Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>
    );


};