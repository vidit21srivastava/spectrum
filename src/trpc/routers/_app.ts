import { workflowRouter } from '@/features/workflows/server/router';
import { createTRPCRouter } from '../init';
import { credentialsRouter } from '@/features/credentials/server/router';


export const appRouter = createTRPCRouter({
    workflows: workflowRouter,
    credentials: credentialsRouter
});

export type AppRouter = typeof appRouter;