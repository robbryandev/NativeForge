import { z } from 'zod';
import {publicProcedure, router} from './server';

export const appRouter = router({
    greeting: publicProcedure
      // This is the input schema of your procedure
      // 💡 Tip: Try changing this and see type errors on the client straight away
      .input(
        z.object({
          name: z.string().nullish(),
        }),
      )
      .query(({ input }) => {
        // This is what you're returning to your client
        return {
          text: `hello ${input?.name ?? 'world'}`,
        };
      }),
  });

export type AppRouter = typeof appRouter;