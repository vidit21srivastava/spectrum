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


const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/,
            { message: "Variable name must start with a letter or underscore and must contain only letters, numbers, and underscores." }),
    endpoint: z.string().min(1, { message: "Please enter a valid URL" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z
        .string()
        .optional()
})

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface HttpRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: HttpRequestDialogProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            endpoint: defaultValues.endpoint || "",
            method: defaultValues.method || "GET",
            body: defaultValues.body || "",
        }
    });

    // Reset form values when dialog opens with new defaults

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                endpoint: defaultValues.endpoint || "",
                method: defaultValues.method || "GET",
                body: defaultValues.body || "",
            });
        }
    }, [open, defaultValues, form]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const watchMethod = form.watch("method");
    const watchVariableName = form.watch("variableName") || "apiCall";

    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for HTTP Request  node.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                    <Form {...form}>
                        <form
                            id="http-request-form"
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-8 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="variableName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input

                                                placeholder="apiCall"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Use this name to reference the result in other nodes: {" "}
                                            {`{{${watchVariableName}.httpResponse.data}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Method</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="PATCH">PATCH</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The HTTP method to use for this request
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endpoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endpoint URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="placeholder:text-xs"
                                                placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Static URL or use {"{{variables}}"} for simple values or {"{{JSON variable}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {showBodyField && (
                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Request Body</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[120px] font-mono text-sm"
                                                    placeholder={'{\n "userID":"{{httpResponse.data.id}},\n "name":"{{httpResponse.data.name}},\n "items":"{{httpResponse.data.items}}}"\n}'}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                JSON with template variables. Use {"{{variables}}"} for simple values or {"{{JSON variable}}"} to stringify objects
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </form>
                    </Form>
                </div>
                <DialogFooter className="mt-4">
                    <Button type="submit" form="http-request-form">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};