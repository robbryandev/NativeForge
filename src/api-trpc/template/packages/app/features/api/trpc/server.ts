import { initTRPC } from '@trpc/server';

const trpcApi = initTRPC.create();

export const publicProcedure = trpcApi.procedure;
export const router = trpcApi.router;
export const middleware = trpcApi.middleware;

export default trpcApi