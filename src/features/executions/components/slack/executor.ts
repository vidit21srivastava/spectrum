import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";


Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type SlackData = {
    variableName?: string;
    webhookURL?: string;
    content?: string;

};

export const SlackExecutor: NodeExecutor<SlackData> = async (
    {
        data,
        nodeID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        slackChannel().status({
            nodeID,
            status: "loading"
        })
    );

    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Slack node: Message content is required");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);


    try {
        const result = await step.run("slack-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeID,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Slack node: Variable name is missing");
            }

            if (!data.webhookURL) {
                await publish(
                    slackChannel().status({
                        nodeID,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Slack node: Webhook URL is missing");
            }

            await ky.post(data.webhookURL!, {
                json: {
                    content: content, // key depends on webhook config

                }
            });

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content,
                }

            };
        });


        await publish(
            slackChannel().status({
                nodeID,
                status: "success"
            })
        );


        return result;
    } catch (error) {
        await publish(
            slackChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw error;
    }

};