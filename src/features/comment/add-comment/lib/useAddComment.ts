import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "../../../../entities/comment/api/mutations"
import { useAddCommentDialog } from "./useAddCommentDialog"

export const useAddComment = () => {
  const addMutation = useMutation(commentMutations.addMutation())
  const { openAdd, overlay } = useAddCommentDialog()

  const addComment = async (postId: number, userId: number = 1) => {
    const body = await openAdd()
    if (!body) return
    addMutation.mutate({ body, postId, userId })
  }

  return { addComment, overlay, isPending: addMutation.isPending }
}
