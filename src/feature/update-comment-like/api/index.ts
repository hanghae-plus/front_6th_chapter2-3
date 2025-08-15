import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { Comment } from "@/entities/comment"

import { commentApi } from "@/entities/comment"
import { CommentResponse } from "@/entities/comment/model/types"

export const useUpdateCommentLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: Comment) => commentApi.updateLike(comment),

    onError: (_err, variables, context) => {
      const typedContext = context as { previousComments?: Comment[] }
      if (typedContext.previousComments) {
        queryClient.setQueryData(["comments", variables.postId], typedContext.previousComments)
      }
    },

    onMutate: async (comment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", comment.postId] })

      const previousComments = queryClient.getQueryData(["comments", comment.postId])

      queryClient.setQueryData(["comments", comment.postId], (prevResponse: CommentResponse): CommentResponse => {
        if (!prevResponse) return prevResponse
        return {
          ...prevResponse,
          comments: prevResponse.comments.map((prevComment) =>
            prevComment.id === comment.id ? { ...prevComment, likes: comment.likes + 1 } : prevComment,
          ),
        }
      })
      return previousComments
    },
  })
}
