import { ReactNode } from "react"

import { Footer } from "@/widgets/layout/Footer"
import { Header } from "@/widgets/layout/Header"

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
