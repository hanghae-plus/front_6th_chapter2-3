import { BrowserRouter as Router } from "react-router-dom"
import Header from "./components/Header.tsx"
import Footer from "./components/Footer.tsx"
import { PostsManagerPage } from "./pages/posts-manager"
import { StoreProvider } from "./app/providers"

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  )
}

export default App
