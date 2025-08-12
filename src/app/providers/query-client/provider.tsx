import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientConfig } from './config.ts';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = new QueryClient(queryClientConfig);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
