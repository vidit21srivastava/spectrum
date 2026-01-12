import type { NodeExecutor } from "@/app/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type httpRequestData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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

    // const result = await step.run("http-request", async () => context);
    // const result = await step.fetch(data.endpoint);
    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = { method };
        if (["POST", "PUT", "PATCH"].includes(method)) {
            if (data.body) {
                options.body = data.body;
            }
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        };

    });

    //TODO: Publish "success" state for manual trigger
    return result;
};