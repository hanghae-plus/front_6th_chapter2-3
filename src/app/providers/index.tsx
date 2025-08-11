import { ReactNode } from "react"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { StoreProvider } from "@/app/providers/StoreProvider"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryProvider>
      <StoreProvider>{children}</StoreProvider>
    </QueryProvider>
  )
}
