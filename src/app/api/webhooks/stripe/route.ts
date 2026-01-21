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

        const stripeData = {
            eventId: body.id,
            eventType: body.type,
            timeStamp: body.created,
            livemode: body.livemode,
            raw: body.data?.object,
        }

        await sendWorkflowExecution({
            workflowID,
            initialData: {
                stripe: stripeData,
            }
        });

        return NextResponse.json(
            { success: true },
            { status: 200 },
        );

    } catch (error) {
        console.log("Stripe webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process Stripe event" },
            { status: 500 },
        )
    }
};