import { BrowserRouter as Router } from "react-router-dom"
import { AppProviders } from "./providers"
import App from "../App.tsx"

const AppRoot = () => {
  return (
    <AppProviders>
      <Router>
        <App />
      </Router>
    </AppProviders>
  )
}

export default AppRoot
