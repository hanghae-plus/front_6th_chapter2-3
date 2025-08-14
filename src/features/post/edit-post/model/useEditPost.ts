import { useMutation } from "@tanstack/react-query"
import { postMutations } from "../../../../entities/post/api/mutations"
import { useEditPostDialog } from "./useEditPostDialog"
import type { Post } from "../../../../entities/post/model"

export const useEditPost = () => {
  const updateMutation = useMutation(postMutations.updateMutation())
  const { openEdit, overlay } = useEditPostDialog()

  const editPost = async (post: Post) => {
    const next = await openEdit(post)
    if (!next) return
    updateMutation.mutate({ id: next.id, post: next })
  }

  return { editPost, overlay, isPending: updateMutation.isPending }
}
