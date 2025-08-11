import { queryClient } from "@/shared/lib"
import { QueryClientProvider } from "@tanstack/react-query"
import { OverlayProvider } from "overlay-kit"

import { NuqsAdapter } from "nuqs/adapters/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./style.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </OverlayProvider>
    </QueryClientProvider>
  </StrictMode>,
)
