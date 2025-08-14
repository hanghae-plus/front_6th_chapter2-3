import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { Comment, CommentPaginatedResponse } from "@/entities/comment/model"
import { likeComment } from "@/entities/comment/api"

interface LikeCommentParams {
  commentId: number
  postId: number
  currentLikes: number
}

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId, currentLikes }: LikeCommentParams) => {
      return likeComment(commentId, currentLikes + 1)
    },
    onSuccess: (updatedComment: Comment, variables: LikeCommentParams) => {
      queryClient.setQueriesData(
        { queryKey: commentKeys.listByPost(variables.postId) },
        (old: CommentPaginatedResponse) => {
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
