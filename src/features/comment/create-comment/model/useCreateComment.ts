import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { createComment } from "@/entities/comment/api"
import { Comment, CreateComment, CommentPaginatedResponse } from "@/entities/comment/model"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: CreateComment) => {
      return createComment(comment)
    },
    onSuccess: (newComment: Comment, variables: CreateComment) => {
      queryClient.setQueriesData(
        { queryKey: commentKeys.listByPost(variables.postId) },
        (old: CommentPaginatedResponse) => {
          return {
            ...old,
            comments: [...old.comments, newComment],
            total: old.total + 1,
          }
        },
      )
    },
  })
}
