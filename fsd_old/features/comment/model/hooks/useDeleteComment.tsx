import { http } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { COMMENT_QUERY_KEY, GetCommentResponse } from "@entities/comment"

interface DeleteCommentBody {
  id: number
  postId?: number // postId 추가하여 어떤 포스트의 댓글인지 알 수 있게 함
}

const deleteComment = async ({ id }: DeleteCommentBody) => {
  const response = await http.delete(`/comments/${id}`)

  return response
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, variables) => {
      // 가짜 API이므로 클라이언트에서 직접 캐시 업데이트
      if (variables.postId) {
        queryClient.setQueryData(COMMENT_QUERY_KEY.detail([variables.postId]), (oldData: GetCommentResponse) => {
          if (!oldData) return oldData

          // 해당 댓글을 목록에서 제거
          return {
            ...oldData,
            comments: oldData.comments.filter((comment) => comment.id !== variables.id),
            total: oldData.total - 1,
          }
        })
      } else {
        // postId가 없는 경우 전체 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: COMMENT_QUERY_KEY.all,
        })
      }
    },
  })
}
