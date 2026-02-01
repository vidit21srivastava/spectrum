import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky from "ky";
import { discordChannel } from "@/inngest/channels/discord";


Handlebars.registerHelper("JSON", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});

type DiscordData = {
    variableName?: string;
    webhookURL?: string;
    content?: string;
    username?: string;

};

export const DiscordExecutor: NodeExecutor<DiscordData> = async (
    {
        data,
        nodeID,
        userID,
        context,
        step,
        publish,
    }
) => {
    await publish(
        discordChannel().status({
            nodeID,
            status: "loading"
        })
    );

    if (!data.content) {
        await publish(
            discordChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw new NonRetriableError("Discord node: Message content is required");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username
        ? decode(Handlebars.compile(data.username)(context))
        : undefined;



    try {
        const result = await step.run("discord-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    discordChannel().status({
                        nodeID,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Discord node: Variable name is missing");
            }

            if (!data.webhookURL) {
                await publish(
                    discordChannel().status({
                        nodeID,
                        status: "error"
                    })
                );
                throw new NonRetriableError("Discord node: Webhook URL is missing");
            }

            await ky.post(data.webhookURL!, {
                json: {
                    content: content.slice(0, 2000), // discord max msg length
                    username,
                }
            });

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                }

            };
        });


        await publish(
            discordChannel().status({
                nodeID,
                status: "success"
            })
        );


        return result;
    } catch (error) {
        await publish(
            discordChannel().status({
                nodeID,
                status: "error"
            })
        );
        throw error;
    }

};