import { createBrowserRouter } from "react-router-dom"

import { PostsManagerPage } from "@/pages/posts-manager/ui"
import { AppLayout } from "@/shell/ui/AppLayout"

const isProd = import.meta.env.MODE === "production"
const basename = isProd ? "/front_6th_chapter2-3" : "/"

export const appRouter = createBrowserRouter(
  [
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
  ],
  { basename },
)
