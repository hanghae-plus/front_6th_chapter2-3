import { useQuery } from "@tanstack/react-query"
import { getPost } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { getCommentsByPost } from "@/entities/comment/api"
import type { Author } from "@/shared/types"

export const usePostDetail = (id: number | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Post ID is required")

      // 게시물과 댓글을 병렬로 가져오기
      const [postResponse, commentsResponse, usersResponse] = await Promise.all([
        getPost(id),
        getCommentsByPost(id),
        getUsers(),
      ])

      // 사용자 정보를 Map으로 변환하여 빠른 조회 가능하게 함
      const userMap = new Map(usersResponse.users.map((u) => [u.id, u]))

      // 게시물에 작성자 정보 추가
      const postWithAuthor = {
        ...postResponse,
        author: userMap.get(postResponse.userId) as Author,
      }

      // 댓글은 이미 user 정보가 포함되어 있으므로 그대로 사용
      const comments = commentsResponse.comments

      return {
        post: postWithAuthor,
        comments: comments,
        total: commentsResponse.total,
      }
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })

  return { data, isLoading, error }
}
