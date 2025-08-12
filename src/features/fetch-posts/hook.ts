import { usePostsQuery } from "../../entities/post/hook"
import { useUsersQuery } from "../../entities/user/hook"
import { joinPostsWithUsers } from "./util"

/**
 * 게시물 목록 조회
 * @param limit - 페이지당 게시물 수
 * @param skip - 건너뛸 게시물 수
 * @returns 게시물 목록
 */
export const useFetchPosts = (limit: number, skip: number) => {
  const posts = usePostsQuery(limit, skip)
  //TODO : 아래 매직넘버와 상수는 constant로 빼내기!!
  const users = useUsersQuery(0, "username,image")

  const postsWithUsers = joinPostsWithUsers(posts.data?.posts || [], users.data?.users || [])
  console.log("postsWithUsers", postsWithUsers)
  return {
    isLoading: posts.isLoading || users.isLoading,
    isError: posts.isError || users.isError,
    posts: postsWithUsers,
    total: posts.data?.total,
  }
}
