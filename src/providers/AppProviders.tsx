import { PropsWithChildren, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

type AppProvidersProps = PropsWithChildren<{
  client?: QueryClient
}>

export function AppProviders({ children, client }: AppProvidersProps) {

  const queryClient = useMemo(() => client ?? new QueryClient(), [client])
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}