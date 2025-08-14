import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

interface Props {
  devtools?: boolean;
  children: React.ReactNode;
}

export const QueryProvider = ({ devtools = false, children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {devtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
