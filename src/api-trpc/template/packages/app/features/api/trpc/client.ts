import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'app/features/api/trpc/router';

export const trpc = createTRPCReact<AppRouter>();