import { Routes, Route } from "react-router-dom"
import PostsManagerPage from "./pages/PostsManagerPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostsManagerPage />} />
    </Routes>
  )
}

export default App
