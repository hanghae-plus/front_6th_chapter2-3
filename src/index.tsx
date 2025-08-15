import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import { AppProviders } from "./providers/AppProviders"
import { queryClient } from "./shared/lib/queryClient"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AppProviders client={queryClient}>
        <App />
      </AppProviders>
    </Router>
  </React.StrictMode>,
)