'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';

/**
 * RootQueryProvider
 * 
 * Provides React Query client context to the entire application
 * Wraps all components that need access to query caching and state management
 * 
 * Includes React Query Devtools for debugging in development
 */
export function RootQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
