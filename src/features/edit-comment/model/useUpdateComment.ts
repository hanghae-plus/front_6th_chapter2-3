import { useSetAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCommentApi } from "../../../entities/comments/api"
import { isEditCommentModalOpenAtom } from "./atoms"

export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  const setIsEditCommentModalOpen = useSetAtom(isEditCommentModalOpenAtom)

  return useMutation({
    mutationFn: (updatedComment: { id: number; body: string }) =>
      updateCommentApi(updatedComment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      setIsEditCommentModalOpen(false)
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })
}
