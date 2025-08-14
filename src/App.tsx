import { AppProviders } from "@app/providers"
import Footer from "@app/layouts/Footer"
import Header from "@/app/layouts/Header"
import PostsManagerPage from "@pages/posts-manager/ui/PostsManagerPage"

const App = () => {
  return (
    <AppProviders>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </AppProviders>
  )
}

export default App
