import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "../../../../entities/comment/api/mutations"

export const useLikeComment = () => {
  const likeMutation = useMutation({ ...commentMutations.likeMutation() })

  const likeComment = (postId: number, id: number, currentLikes: number) => {
    likeMutation.mutate({ id, postId, likes: currentLikes + 1 })
  }

  return { likeComment, isPending: likeMutation.isPending }
}
