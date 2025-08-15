import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCommentApi } from "../../../entities/comments/api"

export const useAddComment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCommentApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      onSuccessCallback?.()
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })
}
