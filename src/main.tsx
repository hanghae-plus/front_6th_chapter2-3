import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import { QueryProvider } from "@/app/ui/query-provider";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
