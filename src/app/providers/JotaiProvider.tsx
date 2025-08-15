import { Provider } from "jotai"
import { PropsWithChildren } from "react"
import { ToastContainer } from "../../shared/ui/Toast"

export const JotaiProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider>
      {children}
      <ToastContainer />
    </Provider>
  )
}
