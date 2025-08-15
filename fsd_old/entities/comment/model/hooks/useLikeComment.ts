import { http } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { COMMENT_QUERY_KEY } from "../keys"
import { Comment } from "@entities/comment/model/types"

interface GetCommentResponse {
  total: number
  skip: number
  limit: number
  comments: Comment[]
}

const likeComment = async (commentId: number) => {
  const response = await http.patch(`/comments/${commentId}`, {
    likes: 1, // 간단하게 1 증가로 처리
  })
  return response
}

export const useLikeComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeComment,
    onSuccess: (_, commentId) => {
      // 가짜 API이므로 클라이언트에서 직접 캐시 업데이트
      queryClient.setQueryData(COMMENT_QUERY_KEY.detail([postId]), (oldData: GetCommentResponse) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          comments: oldData.comments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        }
      })
    },
  })
}
