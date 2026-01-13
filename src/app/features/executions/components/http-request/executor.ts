import type { NodeExecutor } from "@/app/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("JSON", (context) => JSON.stringify(context, null, 2));

type httpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<httpRequestData> = async (
    {
        data,
        nodeID,
        context,
        step,
    }
) => {
    // TODO : Publish "loading" state for manual trigger

    if (!data.endpoint) {
        // TODO : PUblish "error" state for http request
        throw new NonRetriableError("HTTP Request Node: No endpoint configured");
    }

    if (!data.variableName) {
        // TODO : PUblish "error" state for http request
        throw new NonRetriableError("HTTP Request Node: Variable name not configured");
    }

    if (!data.method) {
        // TODO : PUblish "error" state for http request
        throw new NonRetriableError("HTTP Request Node: Method not configured");
    }
    // const result = await step.run("http-request", async () => context);
    // const result = await step.fetch(data.endpoint);
    const result = await step.run("http-request", async () => {

        const endpoint = Handlebars.compile(data.endpoint)(context); // https://.../{{todo.httpResponse.data.userID}}
        // console.log("ENDPOINT", { endpoint });
        const method = data.method;

        const options: KyOptions = { method };
        if (["POST", "PUT", "PATCH"].includes(method)) {
            const resolved = Handlebars.compile(data.body || "{}")(context);
            console.log("Body:", { resolved });
            JSON.parse(resolved); //--> to protect from any invalid JSON being passed
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json",
            }

        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            },
        };


        return {
            ...context,
            [data.variableName]: responsePayload,
        };

    });

    //TODO: Publish "success" state for manual trigger
    return result;
};