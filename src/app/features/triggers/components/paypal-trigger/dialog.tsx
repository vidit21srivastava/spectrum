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
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface PayPalTriggerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PayPalTriggerDialog = ({
    open,
    onOpenChange
}: PayPalTriggerDialogProps) => {

    const params = useParams();
    const workflowID = params.workflowID as string;

    // webhook url
    // const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const baseURL = process.env.NGROK_URL || "sharice-wannest-smelly.ngrok-free.dev";
    const webhookURL = `https://${baseURL}/api/webhooks/paypal?workflowID=${workflowID}`;

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
            <DialogContent className="max-h-[85vh] flex flex-col">
                <DialogTitle>PayPal Trigger Configuration</DialogTitle>
                <DialogDescription>
                    Use this webhook URL in your PayPal Dashboard to trigger this workflow on payment events.
                </DialogDescription>
                <DialogHeader>
                    <div className="flex-1 overflow-y-auto px-1">
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
                                        <li>Open your PayPal Dashboard.</li>
                                        <li>Go to App&Credentials &rarr; App Name &rarr; Webhooks. </li>
                                        <li>Click &quot;Add Webhook&quot;.</li>
                                        <li>Copy and paste the above webhook URL.</li>
                                        <li>Select events to listen for (e.g., PAYMENTS.PAYMENT.CREATED).</li>
                                        <li>Save and copy the signing secret.</li>
                                    </ol>
                                </div>

                                <div className="rounded-lg bg-muted p-4 space-y-2">
                                    <h4 className="font-medium text-sm">Available Variables</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>&bull;&ensp;
                                            <code className="bg-accent px-1 py-0.5 rounded">
                                                {"{{paypal.amount}}"}
                                            </code>&ensp;&mdash; Payment Amount
                                        </li>
                                        <li>&bull;&ensp;
                                            <code className="bg-accent px-1 py-0.5 rounded">
                                                {"{{paypal.currency}}"}
                                            </code>&ensp;&mdash; Currency Code
                                        </li>
                                        <li>&bull;&ensp;
                                            <code className="bg-accent px-1 py-0.5 rounded">
                                                {"{{paypal.customerId}}"}
                                            </code>&ensp;&mdash; Customer ID
                                        </li>
                                        <li>&bull;&ensp;
                                            <code className="bg-accent px-1 py-0.5 rounded">
                                                {"{{paypal.eventType}}"}
                                            </code>&ensp;&mdash; Event type (e.g., PAYMENTS.PAYMENT.CREATED)
                                        </li>
                                        <li>&bull;&ensp;
                                            <code className="bg-accent px-1 py-0.5 rounded">
                                                {"{{JSON paypal}}"}
                                            </code>&ensp;&mdash; Full event data as JSON
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};