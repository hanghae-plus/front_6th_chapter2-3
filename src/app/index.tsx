import AppLayout from './layouts/AppLayout.tsx'
import { AppProviders } from './providers/index.tsx'

export function App() {
  return (
    <AppProviders>
      <AppLayout />
    </AppProviders>
  )
}

export default App
