import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model"
import { Comment, CommentPaginatedResponse } from "@/entities/comment/model"
import { deleteComment } from "@/entities/comment/api"

interface DeleteCommentParams {
  commentId: number
  postId: number
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentParams) => {
      return deleteComment(commentId)
    },
    onSuccess: (_, variables: DeleteCommentParams) => {
      queryClient.setQueriesData(
        { queryKey: commentKeys.listByPost(variables.postId) },
        (old: CommentPaginatedResponse) => {
          if (!old?.comments) return old
          return {
            ...old,
            comments: old.comments.filter((comment: Comment) => comment.id !== variables.commentId),
            total: old.total - 1,
          }
        },
      )
    },
  })
}
