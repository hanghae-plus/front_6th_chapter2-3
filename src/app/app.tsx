import AppRoutes from "./app-routes.tsx"
import TanstackProvider from "./provider/tanstack-query.tsx"

const App = () => {
  return (
    <TanstackProvider>
      <AppRoutes />
    </TanstackProvider>
  )
}

export default App
