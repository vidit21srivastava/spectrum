"use client";

import { ExecutionStatus } from "@/generated/prisma";
import { ChevronsUpDown, CircleAlert, CircleCheck, ClockFading, RefreshCw, Copy, Check, CopyCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSuspenseExecution } from "../hooks/use-executions";
import { formatStatus, getStatusIcon } from "./executions";
import { Button } from "@/components/ui/button";


export const ExecutionLog = ({ executionID }: { executionID: string }) => {

    const { data: execution } = useSuspenseExecution(executionID);

    const [showStackTrace, setShowStackTrace] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);

    const duration = execution.completedAt
        ? Math.round(
            (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
        : null;

    const handleCopyError = () => {
        if (!execution.error) return;
        const text = `Error: ${execution.error}\n\nError Stack Trace:\n${execution.errorStack || ''}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyOutput = () => {
        if (!execution.output) return;
        const text = JSON.stringify(execution.output, null, 2);
        navigator.clipboard.writeText(text);
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
    };

    return (
        <Card className="shadow-none max-h-[90vh] flex flex-col">
            <CardHeader className="flex-none">
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                        <CardTitle>
                            {formatStatus(execution.status)}
                        </CardTitle>
                        <CardDescription>
                            Execution for {execution.workflow.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Workflow
                        </p>
                        <Link prefetch className="text-sm hover:underline text-primary" href={`/workflows/${execution.workflowID}`}>
                            {execution.workflow.name}
                        </Link>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Event ID</p>
                        <p className="text-sm">{execution.inngestEventID}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="text-sm">{formatStatus(execution.status)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Started</p>
                        <p className="text-sm">{formatDistanceToNow(execution.startedAt, { addSuffix: true })}</p>
                    </div>

                    {execution.completedAt ? (<div>
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <p className="text-sm">{formatDistanceToNow(execution.completedAt, { addSuffix: true })}</p>
                    </div>) : null}

                    {duration !== null ? (<div>
                        <p className="text-sm font-medium text-muted-foreground">Duration</p>
                        <p className="text-sm">{duration}s</p>
                    </div>) : null}




                </div>

                {execution.output && (<div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium text-foreground mb-3">Output</p>
                    <div className="relative overflow-auto max-h-[40vh] rounded-md bg-accent/60">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="sticky top-2 float-right mt-2 mr-2 h-6 w-6 bg-muted hover:bg-muted shadow-none z-10"
                            onClick={handleCopyOutput}
                        >
                            {copiedOutput ? <Check className="size-3" /> : <Copy className="size-3" />}
                        </Button>
                        <pre className="whitespace-pre-wrap p-3 text-xs font-mono text-secondary">
                            {JSON.stringify(execution.output, null, 2)}
                        </pre>
                    </div>
                </div>)}

                {execution.error && (<div className="relative mt-6 p-4 bg-red-50 rounded-lg space-y-3 ">
                    <div className="overflow-auto">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-red-800">Error</p>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                className="h-6 w-6 text-red-800 border-red-200 bg-transparent hover:bg-red-100 hover:text-red-900"
                                onClick={handleCopyError}
                            >
                                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                            </Button>
                        </div>

                        <p className="text-sm text-red-800 font-light wrap-break-word whitespace-pre-wrap">{execution.error}</p>
                    </div>
                    {execution.errorStack && (
                        <Collapsible open={showStackTrace}
                            onOpenChange={setShowStackTrace}>
                            <div className="flex items-center gap-2 my-2">

                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-red-800/90 hover:bg-red-100"
                                    >
                                        <ChevronsUpDown className="size-3 " />
                                        {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}

                                    </Button>

                                </CollapsibleTrigger>
                                <div className="h-px bg-red-300 flex-1" />
                            </div>
                            <CollapsibleContent>
                                <pre className="mt-2 text-xs font-light text-red-800/70 whitespace-pre-wrap p-3 bg-red-100 rounded-md overflow-auto max-h-[40vh]">
                                    {execution.errorStack}
                                </pre>
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </div>)}
            </CardContent>
        </Card>
    );


}