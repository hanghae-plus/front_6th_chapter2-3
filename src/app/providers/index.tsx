import { ReactNode } from "react"
import { QueryProvider } from "@/app/providers/QueryProvider"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return <QueryProvider>{children}</QueryProvider>
}
