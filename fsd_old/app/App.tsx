import { Providers } from "@app/providers/Providers"
import { Routers } from "@app/routers/Routers"
import "./styles/globals.css"

const App = () => {
  return (
    <Providers>
      <Routers />
    </Providers>
  )
}

export default App
