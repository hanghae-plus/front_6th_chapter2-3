import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model"
import { Comment, CommentPaginatedResponse } from "@/entities/comment/model"
import { updateComment } from "@/entities/comment/api"

interface UpdateCommentParams {
  commentId: number
  body: string
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId, body }: UpdateCommentParams) => {
      return updateComment(commentId, { body })
    },
    onSuccess: (updatedComment: Comment, variables: UpdateCommentParams) => {
      queryClient.setQueriesData(
        { queryKey: commentKeys.listByPost(updatedComment.postId) },
        (old: CommentPaginatedResponse) => {
          if (!old?.comments) return old
          return {
            ...old,
            comments: old.comments.map((comment: Comment) =>
              comment.id === variables.commentId ? updatedComment : comment,
            ),
          }
        },
      )
    },
  })
}
