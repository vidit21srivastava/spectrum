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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/,
            { message: "Variable name must start with a letter or underscore and must contain only letters, numbers, and underscores." }),
    username: z.string().optional(),
    content: z
        .string()
        .min(1, "Message content is required")
        .max(2000, "Discord messages cannot exceed 2000 characters"),
    webhookURL: z.string().min(1, "Webhook URL is required"), // using string for templating from previous node
})

export type DiscordFormValues = z.infer<typeof formSchema>;

interface DiscordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: DiscordDialogProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            username: defaultValues.username || "",
            content: defaultValues.content || "",
            webhookURL: defaultValues.webhookURL || "",
        }
    });

    // Reset form values when dialog opens with new defaults

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                username: defaultValues.username || "",
                content: defaultValues.content || "",
                webhookURL: defaultValues.webhookURL || "",
            });
        }
    }, [open, defaultValues, form]);

    // eslint-disable-next-line react-hooks/incompatible-library    
    const watchVariableName = form.watch("variableName") || "myDiscord";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the discord webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                    <Form {...form}>
                        <form
                            id="discord-node-form"
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-3 mt-4"
                        >

                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input

                                                placeholder="myDiscord"
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
                                name="webhookURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Webhook URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://discord.com/api/webhooks/..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Get this from Discord: Channel Settings &rarr; Integration &rarr; Webhooks
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bot Username (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Workflow Bot"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Override the webhook&apos;s default username
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-20 font-mono text-sm"
                                                placeholder="Summarize this text: {{myModel.text}}"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* To change */}
                                        <FormDescription>
                                            Message content to send to discord. Use {"{{variables}}"} for simple values or {"{{JSON variable}}"} to stringify objects.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </form>
                    </Form>
                </div>
                <DialogFooter className="mt-4">
                    <Button type="submit" form="discord-node-form">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};