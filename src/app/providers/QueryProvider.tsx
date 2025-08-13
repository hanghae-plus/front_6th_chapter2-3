import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/config';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
