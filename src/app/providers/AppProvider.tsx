import { ReactNode } from "react"

import { QueryProvider } from "@/app/providers/QueryProvider"
import { RouterProvider } from "@/app/providers/RouterProvider"

interface AppProvidersProps {
  children: ReactNode
}
export function AppProvider({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <RouterProvider>{children}</RouterProvider>
    </QueryProvider>
  )
}
