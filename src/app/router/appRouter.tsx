import { createBrowserRouter } from "react-router-dom"

import { AppLayout } from "@/app/ui/AppLayout"
import { PostsManagerPage } from "@/pages/posts-manager/ui"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <PostsManagerPage />,
      },
    ],
  },
])
