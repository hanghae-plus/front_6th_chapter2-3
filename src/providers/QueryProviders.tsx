import { PropsWithChildren } from "react"
import { queryClient } from "../shared/lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const QueryProvider = ({ children } : PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {(import.meta as any).env?.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}