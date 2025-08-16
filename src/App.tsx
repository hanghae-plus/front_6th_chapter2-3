import { BrowserRouter as Router } from "react-router-dom"
import { PostsManager } from "./pages"
import { Footer, Header } from "./widgets"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManager />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
