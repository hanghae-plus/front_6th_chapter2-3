import { AppProviders } from "./providers"
import App from "../App.tsx"

const AppRoot = () => {
  return (
    <AppProviders>
      <App />
    </AppProviders>
  )
}

export default AppRoot
