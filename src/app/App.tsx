import { Providers } from "@app/providers"
import { Routers } from "@app/routers"
import "./styles/globals.css"

const App = () => {
  return (
    <Providers>
      <Routers />
    </Providers>
  )
}

export default App
