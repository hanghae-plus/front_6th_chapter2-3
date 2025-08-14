import { Outlet } from "react-router-dom"
import Header from "../../shared/ui/Header"
import Footer from "../../shared/ui/Footer"

const GlobalLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default GlobalLayout
