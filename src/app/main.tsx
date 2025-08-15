import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { AppRouter } from "@/app/router/AppRouter"
import "@/app/styles/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
