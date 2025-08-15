import { BrowserRouter as Router } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode } from "react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { queryClient } from "@shared/config/query-client"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Router>{children}</Router>
      </NuqsAdapter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
