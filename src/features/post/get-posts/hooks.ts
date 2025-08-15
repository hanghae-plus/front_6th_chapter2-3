import { usePosts } from "../../../entities/post/model/hooks"
import { useUserList } from "../../../entities/user/hooks"
import { joinPostsWithUsers } from "./util"

export const useGetPosts = (
  limit: number,
  skip: number,
  sortBy?: string,
  order?: string,
  tag?: string,
  searchQuery?: string,
) => {
  const effectiveSortBy = sortBy || undefined
  const effectiveSortOrder = order || "asc"

  const posts = usePosts(limit, skip, effectiveSortBy, effectiveSortOrder, tag, searchQuery)
  const users = useUserList(0, "username,image")

  const postsWithUsers = joinPostsWithUsers(posts.data?.posts || [], users.data?.users || [])

  return {
    loading: posts.isLoading || users.isLoading,
    posts: postsWithUsers || [],
    total: posts.data?.total || 0,
  }
}
