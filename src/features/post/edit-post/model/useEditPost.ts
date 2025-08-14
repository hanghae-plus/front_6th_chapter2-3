import { useMutation } from "@tanstack/react-query"
import { postMutations } from "@entities/post/api/mutations"
import type { Post } from "@entities/post/model"
import { useEditPostDialog } from "./useEditPostDialog"

export const useEditPost = () => {
  const { openEdit, overlay } = useEditPostDialog()
  const editMutation = useMutation(postMutations.updateMutation())

  const editPost = async (initial: Post) => {
    const updated = await openEdit(initial)
    if (!updated) return

    editMutation.mutate({ id: updated.id, post: updated })
  }

  return { editPost, overlay, isPending: editMutation.isPending }
}
