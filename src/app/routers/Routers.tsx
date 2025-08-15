import { Layout } from "@app/layout"
import { PostsManagerPage } from "@pages/PostsManagerPage/PostsManagerPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"

export const Routers = () => {
  const basename = import.meta.env.PROD ? "/front_6th_chapter2-3" : ""

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <PostsManagerPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
