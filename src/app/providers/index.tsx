import { ReactNode } from "react"

import { QueryProvider } from "./QueryProvider"
import { RouterProvider } from "./RouterProvider"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProvidersProps) => {
  return (
    <RouterProvider>
      <QueryProvider>{children}</QueryProvider>
    </RouterProvider>
  )
}
