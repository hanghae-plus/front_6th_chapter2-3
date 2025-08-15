import { Footer } from "@app/layout/Footer"
import { Header } from "@app/layout/Header"
import { Outlet } from "react-router-dom"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}
