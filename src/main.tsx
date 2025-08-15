import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

import { useErrorStore } from '@/shared/stores/errorStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
    mutations: {
      onError: (error: Error) => {
        console.error('Global Mutation Error:', error);
        useErrorStore.getState().setError(error);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error) => {
      console.error('Global Query Error:', error);
      useErrorStore.getState().setError(error);
    },
  }),
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
