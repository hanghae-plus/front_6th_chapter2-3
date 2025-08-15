import { useMutation, useQueryClient } from "@tanstack/react-query"

import { commentApi } from "@/entities/comment"
import { Comment, CommentResponse } from "@/entities/comment/model/types"

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedComment: Comment) => commentApi.update(updatedComment),
    onSuccess: (updatedComment) => {
      queryClient.setQueriesData(
        { queryKey: ["comments", updatedComment.postId] },
        (prevResponse: CommentResponse): CommentResponse => {
          if (!prevResponse) return prevResponse
          return {
            ...prevResponse,
            comments: prevResponse.comments.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          }
        },
      )
    },
  })
}
