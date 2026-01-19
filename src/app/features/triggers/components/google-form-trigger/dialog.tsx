"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle

} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon, EllipsisVerticalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface GoogleFormTriggerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
    open,
    onOpenChange
}: GoogleFormTriggerDialogProps) => {

    const params = useParams();
    const workflowID = params.workflowID as string;

    // webhook url
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookURL = `${baseURL}/api/webhooks/google-form?workflowID=${workflowID}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookURL);
            toast.success("Webhook URL copied to clipboard");
        } catch {
            toast.error("Failed to copy URL");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Google Forms Trigger Configuration</DialogTitle>
                <DialogDescription>
                    Use this webhook URL in your Google Form&apos;s Apps Script to trigger this workflow when a form is submitted.
                </DialogDescription>
                <DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">
                                Webhook URL
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="webhook-url"
                                    value={webhookURL}
                                    readOnly
                                    className="font-mono text-sm" />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={copyToClipboard}
                                >
                                    <CopyIcon className="size-4" />
                                </Button>
                            </div>
                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                <h4 className="font-medium text-sm">Setup Instructions</h4>
                                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                    <li>Open your Google Form.</li>
                                    <li> Click Menu <EllipsisVerticalIcon className="inline size-4 align-middle bg-accent text-muted-foreground border p-0.5 rounded" /> &rarr; Apps Script. </li>
                                    <li>Copy and paste the script below.</li>
                                    <li>Replace WEBHOOK_URL with your webhook URL above.</li>
                                    <li>Save and click &quot;Triggers&quot; &rarr; Add Trigger.</li>
                                    <li>Choose: From form &rarr; On &apos;Form Submit&apos; &rarr; Save.</li>
                                </ol>
                            </div>
                            <div className="rounded-lg bg-muted p-4 space-y-3">
                                <h4 className="font-medium text-sm">Google Apps Script:</h4>
                                <Button type="button"
                                    variant="outline" onClick={async () => {
                                        const script = generateGoogleFormScript(webhookURL)
                                        try {
                                            await navigator.clipboard.writeText(script);
                                            toast.success("Script copied to clipboard.");
                                        } catch {
                                            toast.success("Failed to copy Script to clipboard.")
                                        }
                                    }} className="text-muted-foreground">
                                    <CopyIcon className="size-4 mr-2" />
                                    Copy Google Apps Script
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    This Script includes your Webhook URL and handles form submissions
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                <h4 className="font-medium text-sm">Available Variables</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{googleForm.respondentEmail}}"}
                                        </code>&ensp;&mdash; Respondent&apos;s Email
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{googleForm.responses['Question Name']}}"}
                                        </code>&ensp;&mdash; Specific Answer
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{JSON googleForm.responses}}"}
                                        </code>&ensp;&mdash; All responses as JSON
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};