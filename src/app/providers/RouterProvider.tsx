import { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"

interface RouterProviderProps {
  children: ReactNode
}

export function RouterProvider({ children }: RouterProviderProps) {
  const basename = import.meta.env.PROD ? "/front_6th_chapter2-3" : ""

  return <BrowserRouter basename={basename}>{children}</BrowserRouter>
}
