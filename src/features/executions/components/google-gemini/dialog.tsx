"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";

export const AVAILABLE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
] as const;


const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/,
            { message: "Variable name must start with a letter or underscore and must contain only letters, numbers, and underscores." }),
    credentialID: z.string().min(1, "Credential is required"),
    model: z.enum(AVAILABLE_MODELS),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
})

export type GoogleGeminiFormValues = z.infer<typeof formSchema>;

interface GoogleGeminiDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<GoogleGeminiFormValues>;
}

export const GoogleGeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: GoogleGeminiDialogProps) => {
    const { data: credentials,
        isLoading: isLoadingCredentials
    } = useCredentialsByType(CredentialType.GOOGLE_GEMINI);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            credentialID: defaultValues.credentialID || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        }
    });

    // Reset form values when dialog opens with new defaults

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialID: defaultValues.credentialID || "",
                model: defaultValues.model || AVAILABLE_MODELS[0],
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
            });
        }
    }, [open, defaultValues, form]);

    // eslint-disable-next-line react-hooks/incompatible-library    
    const watchVariableName = form.watch("variableName") || "myModel";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
                    <DialogDescription>
                        Configure settings for AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                    <Form {...form}>
                        <form
                            id="gemini-node-form"
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    AVAILABLE_MODELS.map((model) => (
                                                        <SelectItem key={model} value={model}>
                                                            <Image
                                                                src="/gemini.svg"
                                                                alt="Gemini"
                                                                width={20}
                                                                height={20}
                                                                className="size-4 object-contain"
                                                            />
                                                            {model}
                                                        </SelectItem>
                                                    ))
                                                }

                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The Gemini model to be used for action
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="credentialID"
                                render={
                                    ({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Credential</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoadingCredentials || !credentials?.length}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {credentials?.map((option) => (
                                                        <SelectItem
                                                            key={option.id}
                                                            value={option.id}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src="/gemini.svg"
                                                                    alt="Gemini"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {option.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Credential to be used for action
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                            />

                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input

                                                placeholder="myModel"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use this name to reference the result in other nodes: {" "}
                                            {`{{${watchVariableName}.text}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="systemPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>System Prompt (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-20 font-mono text-sm"
                                                placeholder="You are a helpful assistant. Your work is to..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Sets the behavior of the assistant. Use {"{{variables}}"} for simple values or {"{{JSON variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Prompt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-[120px] font-mono text-sm"
                                                placeholder="Summarize this text: {{JSON httpResponse.data}}"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The prompt to send to the AI for action. Use {"{{variables}}"} for simple values or {"{{JSON variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter className="mt-4">
                    <Button type="submit" form="gemini-node-form">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};