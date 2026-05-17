import { QueryClient } from '@tanstack/react-query';

// Module-singleton: in Astro every island gets its own React root, but they
// all share this QueryClient instance, so cart-cache writes from a mutation
// in the WineList island are visible in the Header island's `useCart()`.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
