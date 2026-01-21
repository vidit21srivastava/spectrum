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


interface PaymentTriggerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PaymentTriggerDialog = ({
    open,
    onOpenChange
}: PaymentTriggerDialogProps) => {

    const params = useParams();
    const workflowID = params.workflowID as string;

    // webhook url
    // const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const baseURL = process.env.NGROK_URL || "sharice-wannest-smelly.ngrok-free.dev";
    const webhookURL = `https://${baseURL}/api/webhooks/stripe?workflowID=${workflowID}`;

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
                <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                <DialogDescription>
                    Use this webhook URL in your Stripe Dashboard to trigger this workflow on payment events.
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
                                    <li>Open your Stripe Dashboard.</li>
                                    <li>Go to Developers &rarr; Webhooks. </li>
                                    <li>Click &quot;Add Webhook&quot;.</li>
                                    <li>Paste the webhook URL above.</li>
                                    <li>Select events to listen for (e.g., payment_intent.succeeded).</li>
                                    <li>Save and copy the signing secret.</li>
                                </ol>
                            </div>

                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                <h4 className="font-medium text-sm">Available Variables</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{stripe.amount}}"}
                                        </code>&ensp;&mdash; Payment Amount
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{stripe.currency}}"}
                                        </code>&ensp;&mdash; Currency Code
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{stripe.customerId}}"}
                                        </code>&ensp;&mdash; Customer ID
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{stripe.eventType}}"}
                                        </code>&ensp;&mdash; Event type (e.g., payment_intent.succeeded)
                                    </li>
                                    <li>&bull;&ensp;
                                        <code className="bg-accent px-1 py-0.5 rounded">
                                            {"{{JSON stripe}}"}
                                        </code>&ensp;&mdash; Full event data as JSON
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