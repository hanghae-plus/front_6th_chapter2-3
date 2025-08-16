import { Header, Footer } from "@/app/ui/"
import PostsManagerPage from "@/pages/post-manager/PostsManagerPage"

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PostsManagerPage />
      </main>
      <Footer />
    </div>
  )
}

export default App
