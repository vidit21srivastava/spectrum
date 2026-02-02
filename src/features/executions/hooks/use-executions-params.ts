import { executionsParams } from "@/features/executions/params";
import { useQueryStates } from "nuqs";


export const useExecutionsParams = () => {
    return useQueryStates(executionsParams);
}