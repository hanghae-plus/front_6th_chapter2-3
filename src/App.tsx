import Footer from "@/app/ui/Footer.tsx"
import Header from "@/app/ui/Header.tsx"
import PostsManagerPage from "@/pages/PagePostsManager/PagePostsManager.tsx"

import { queryClient } from "@/app/config/tanstack.query"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter as Router } from "react-router-dom"

const App = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>

          <Footer />
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Router>
  )
}

export default App
