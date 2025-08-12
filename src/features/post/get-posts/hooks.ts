import { usePosts } from "../../../entities/post/hooks"
import { useUserList } from "../../../entities/user/hooks"
import { joinPostsWithUsers } from "./util"

export const useGetPosts = (limit: number, skip: number) => {
  const posts = usePosts(limit, skip)
  const users = useUserList(0, "username,image")

  const postsWithUsers = joinPostsWithUsers(posts.data?.posts || [], users.data?.users || [])

  return {
    isLoading: posts.isLoading || users.isLoading,
    isError: posts.isError || users.isError,
    posts: postsWithUsers,
    total: posts.data?.total,
  }
}
