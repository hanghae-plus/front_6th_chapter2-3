import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"
import type { CommentItem } from "@entities/comment/model"
import { useEditCommentDialog } from "./useEditCommentDialog"

export const useEditComment = () => {
  const updateCommentMutation = useMutation(commentMutations.updateMutation())
  const { openEdit, overlay } = useEditCommentDialog()

  const updateComment = async (comment: CommentItem) => {
    const nextBody = await openEdit(comment.body)
    if (nextBody == null) return
    updateCommentMutation.mutate({ id: comment.id, postId: comment.postId, body: nextBody })
  }

  return { updateComment, overlay, isPending: updateCommentMutation.isPending }
}
