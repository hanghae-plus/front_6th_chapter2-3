import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCommentApi } from "../../../entities/comments/api"

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; postId: number }) => deleteCommentApi(params.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })
}
