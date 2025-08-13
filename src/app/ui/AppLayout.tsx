import { Outlet } from "react-router-dom"

import { Footer } from "@/app/ui/Footer"
import { Header } from "@/app/ui/Header"

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
