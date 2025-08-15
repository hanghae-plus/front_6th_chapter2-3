import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeCommentApi } from "../../../entities/comments/api"

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; postId: number }) => likeCommentApi(params.id, 1),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })
}
