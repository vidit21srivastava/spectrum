import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const url = new URL(req.url);
        const workflowID = url.searchParams.get("workflowID");
        if (!workflowID) {
            return NextResponse.json(
                { success: false, error: "Missing required query parameter: workflowID" },
                { status: 400 },//user error
            );
        };

        const body = await req.json();

        const formData = {
            formID: body.formID,
            formTitle: body.formTitle,
            responseID: body.responseID,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        }

        await sendWorkflowExecution({
            workflowID,
            initialData: {
                googleForm: formData,
            }
        });

    } catch (error) {
        console.log("Google form webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process Google Form submission" },
            { status: 500 },
        )
    }
};