import { Footer, Header } from "@/widgets/layout"
import { PostManagementPage } from "@/views/post-management-page"

import { BrowserRouter as Router } from "react-router-dom"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostManagementPage />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
