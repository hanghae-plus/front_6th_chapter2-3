import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "../../../../entities/post/api"
import { Post, PostWithAuthor } from "../../../../entities/post/types"
import { getUsers } from "../../../../entities/user/api"
import { User } from "../../../../entities/user/types"

/**
 * 게시물 + 작성자 정보 복합 조회
 */
export const fetchPostsWithAuthors = async (params: {
  limit: number
  skip: number
}): Promise<{ posts: PostWithAuthor[]; total: number }> => {
  const [postsData, usersData] = await Promise.all([
    fetchPosts(params),
    getUsers({ limit: 0, select: "username,image" }),
  ])

  const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: User) => user.id === post.userId),
  }))

  return { posts: postsWithUsers, total: postsData.total }
}

export const usePostsWithAuthorsQuery = (params: { limit: number; skip: number }) => {
  return useQuery({
    queryKey: ["posts-with-authors", params],
    queryFn: () => fetchPostsWithAuthors(params),
  })
}
