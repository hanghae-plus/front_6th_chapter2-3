import { queryClient } from "@/shared/lib"

import App from "./App.tsx"

import "./style.css"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NuqsAdapter } from "nuqs/adapters/react"
import { OverlayProvider } from "overlay-kit"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <NuqsAdapter>
          <App />

          <ReactQueryDevtools initialIsOpen={false} />
        </NuqsAdapter>
      </OverlayProvider>
    </QueryClientProvider>
  </StrictMode>,
)
