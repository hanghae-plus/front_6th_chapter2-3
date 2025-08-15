import { useMutation, useQueryClient } from "@tanstack/react-query"

import { commentApi } from "@/entities/comment"
import { CommentResponse } from "@/entities/comment/model/types"

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: commentApi.delete,
    onSuccess: (deletedComment) => {
      queryClient.setQueriesData(
        { queryKey: ["comments", deletedComment.postId] },
        (prevResponse: CommentResponse): CommentResponse => {
          if (!prevResponse) return prevResponse
          return {
            ...prevResponse,
            comments: prevResponse.comments.filter((post) => post.id !== deletedComment.id),
          }
        },
      )
    },
  })
}
