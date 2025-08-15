import { Route, Routes } from "react-router-dom"

import { PostsManagerPage } from "@/pages"

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PostsManagerPage />} path="/" />
    </Routes>
  )
}
