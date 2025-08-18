import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'
import { shouldRetry, handleQueryError, handleMutationError } from '@shared/lib/error-handler'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>{children}</Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
