import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
