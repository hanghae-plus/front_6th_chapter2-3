import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import AppRoot from "./app/index"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)
