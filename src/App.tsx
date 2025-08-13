import { BrowserRouter as Router } from "react-router-dom"
import { AppProviders } from "@/app/providers"
import { Header, Footer } from "@/app/ui/"
import PostsManagerPage from "@/pages/PostsManagerPage"
// import BasicPage from "@/pages/BasicPage"

const App = () => {
  return (
    <AppProviders>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
            {/* <BasicPage /> */}
          </main>
          <Footer />
        </div>
      </Router>
    </AppProviders>
  )
}

export default App
