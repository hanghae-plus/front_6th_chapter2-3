import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'jotai';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface AppProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 1,
    },
  },
});

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Router>{children}</Router>
      </QueryClientProvider>
    </Provider>
  );
};
