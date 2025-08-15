import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import PostsManagerPage from './pages/posts/ui/PostsManagerPage.tsx'

const App = () => {
  const basename = import.meta.env.PROD ? '/front_6th_chapter2-3' : ''
  return (
    <Router basename={basename}>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow container mx-auto px-4 py-8'>
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
