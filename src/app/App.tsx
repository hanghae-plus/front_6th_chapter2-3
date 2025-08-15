import { Route, Routes } from "react-router-dom"

import { AppProvider } from "@/app/providers"
import { PostsManagerPage } from "@/pages"
import { BaseLayout } from "@/widgets/layout"

const App = () => {
  return (
    <AppProvider>
      <BaseLayout>
        <Routes>
          <Route element={<PostsManagerPage />} path="/" />
        </Routes>
      </BaseLayout>
    </AppProvider>
  )
}

export default App
