import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"
import type { CommentItem } from "@entities/comment/model"

export const useLikeComment = () => {
  const likeMutation = useMutation({ ...commentMutations.likeMutation() })

  const likeComment = (comment: CommentItem) => {
    likeMutation.mutate({
      id: comment.id,
      postId: comment.postId,
      likes: (comment.likes || 0) + 1,
      isTemporary: comment.isTemporary,
    })
  }

  return { likeComment, isPending: likeMutation.isPending }
}
