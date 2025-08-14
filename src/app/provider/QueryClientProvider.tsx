// app/providers/QueryProvider.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../shared/lib/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
