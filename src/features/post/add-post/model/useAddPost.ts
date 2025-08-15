import { useMutation } from "@tanstack/react-query"
import { postMutations } from "@entities/post/api/mutations"
import { useAddPostDialog } from "./useAddPostDialog"

export const useAddPost = () => {
  const { openAdd, overlay } = useAddPostDialog()
  const addMutation = useMutation(postMutations.addMutation())

  const addPost = async () => {
    const data = await openAdd()
    if (!data) return

    addMutation.mutate(data)
  }

  return { addPost, overlay, isPending: addMutation.isPending }
}
