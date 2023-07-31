import * as trpcNext from '@trpc/server/adapters/next';
import {appRouter} from 'app/features/api/trpc/router';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});