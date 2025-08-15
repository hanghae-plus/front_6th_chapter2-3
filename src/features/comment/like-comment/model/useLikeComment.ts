import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"
import type { CommentItem } from "@entities/comment/model"
import { commentQueries } from "@entities/comment/api/queries"
import { queryClient } from "@shared/config/query-client"

export const useLikeComment = (postId: number) => {
  const likeMutation = useMutation({ ...commentMutations.likeMutation() })

  const likeComment = (id: number) => {
    const latestCommentsQuery = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(
      commentQueries.byPost(postId),
    )
    const latestComments = latestCommentsQuery?.comments ?? []
    const comment = latestComments.find((c: CommentItem) => c.id === id)

    if (comment) {
      likeMutation.mutate({
        id: comment.id,
        postId: comment.postId,
        likes: (comment.likes || 0) + 1,
        isTemporary: comment.isTemporary,
      })
    }
  }

  return { likeComment, isPending: likeMutation.isPending }
}
