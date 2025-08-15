import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCommentApi } from "../../../entities/comments/api"

export const useUpdateComment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedComment: { id: number; body: string }) =>
      updateCommentApi(updatedComment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      onSuccessCallback?.()
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })
}
