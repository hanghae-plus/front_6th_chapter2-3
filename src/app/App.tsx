import { Layout } from "@/shared/ui"

import { AppProvider } from "./providers"
import { AppRouter } from "./routing/AppRouter"

const App = () => {
  return (
    <AppProvider>
      <Layout>
        <AppRouter />
      </Layout>
    </AppProvider>
  )
}

export default App
