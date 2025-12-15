import { createTRPCRouter } from '../init';
import { workflowRouter } from '@/app/features/workflows/server/router';


export const appRouter = createTRPCRouter({
    workflows: workflowRouter,
});

export type AppRouter = typeof appRouter;