import { useQuery } from "@tanstack/react-query"

import { getPosts } from "@/feature/get-posts/api"
import { getUsersSummary } from "@/feature/get-users-summary"
import { usePostsQuery } from "@/feature/post-query/model/usePostsQuery"

export const usePostsWithUserSummaryQuery = () => {
  const { current, getChangedField } = usePostsQuery()
  const { limit, order, search, skip, sortBy, tag } = current

  return useQuery({
    queryFn: async () => {
      const postsData = await getPosts(current, getChangedField())

      const userData = await getUsersSummary()

      return {
        ...postsData,
        posts: postsData.posts.map((post) => ({
          ...post,
          author: userData.users.find((user) => user.id === post.userId),
        })),
      }
    },
    queryKey: ["posts-with-users", { limit, order, search, skip, sortBy, tag }],
  })
}
