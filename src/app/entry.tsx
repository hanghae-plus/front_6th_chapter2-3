import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./entry.css";
import App from "./layout/BaseLayout.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryProvider } from "./provider/QueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </Router>
  </StrictMode>,
);
