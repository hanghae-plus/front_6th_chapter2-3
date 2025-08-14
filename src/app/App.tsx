import { BrowserRouter as Router } from "react-router-dom"
import Header from "../shared/ui/header/Header.tsx"
import Footer from "../shared/ui/footer/Footer.tsx"
import PostsManagerPage from "../pages/PostsManagerPage.tsx"
import { useInitializeURL } from "../features/update-URL/useInitializeURL"

const App = () => {
  // 앱 시작 시 URL과 store 상태 동기화
  useInitializeURL()

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
