import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import PostsManager from "../pages/posts-manager"
import GlobalLayout from "./ui/globalLayout"

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route index element={<PostsManager />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoute
