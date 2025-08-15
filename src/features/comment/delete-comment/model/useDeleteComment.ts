import { useMutation } from "@tanstack/react-query"
import { commentMutations } from "@entities/comment/api/mutations"
import type { CommentItem } from "@entities/comment/model"
import { commentQueries } from "@entities/comment/api/queries"
import { queryClient } from "@shared/config/query-client"

export const useDeleteComment = (postId: number) => {
  const deleteMutation = useMutation(commentMutations.deleteMutation())

  const deleteComment = (id: number) => {
    const latestCommentsQuery = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(
      commentQueries.byPost(postId),
    )
    const latestComments = latestCommentsQuery?.comments ?? []
    const comment = latestComments.find((c: CommentItem) => c.id === id)

    if (comment) {
      deleteMutation.mutate({
        id: comment.id,
        postId: comment.postId,
        isTemporary: comment.isTemporary,
      })
    }
  }

  return { deleteComment, isPending: deleteMutation.isPending }
}
