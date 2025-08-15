import { PropsWithChildren } from "react"
import { QueryProvider } from "./QueryProviders.tsx"

export const AppProviders = ({children}: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>
}