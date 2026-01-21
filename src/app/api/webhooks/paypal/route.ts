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

        const paypalData = {
            eventId: body.id,
            eventType: body.event_type,
            timeStamp: body.create_time,
            raw: body,
        }

        await sendWorkflowExecution({
            workflowID,
            initialData: {
                paypal: paypalData,
            }
        });

        return NextResponse.json(
            { success: true },
            { status: 200 },
        );

    } catch (error) {
        console.log("PayPal webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process PayPal event" },
            { status: 500 },
        )
    }
};