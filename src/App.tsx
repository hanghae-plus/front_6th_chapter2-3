import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from "./components/Header.tsx"
import Footer from "./components/Footer.tsx"
import PostsManagerPage from "./pages/PostsManagerPage.tsx"
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import { usePreferencesStore } from './shared/stores/preferencesStore'
import { useEffect } from 'react'

const App = () => {
  const darkMode = usePreferencesStore((s) => s.darkMode)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PostsManagerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
