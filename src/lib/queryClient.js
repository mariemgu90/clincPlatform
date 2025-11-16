import { QueryClient } from '@tanstack/react-query';

// Create a client for React Query with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // GC time: how long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed queries once
      retry: 1,
      // Don't retry on client errors (4xx)
      retryOnMount: true,
      // Enable refetching on window focus
      refetchOnWindowFocus: true,
      // Enable refetching on mount if data is stale
      refetchOnMount: true,
      // Show error boundary on error
      throwOnError: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Show error on mutation failure
      throwOnError: true,
    },
  },
});
