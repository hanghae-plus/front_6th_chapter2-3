import { useMutation, useQueryClient } from "@tanstack/react-query"

import { commentApi } from "@/entities/comment"
import { CommentRequest, CommentResponse } from "@/entities/comment/model/types"

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newComment: CommentRequest) => commentApi.create(newComment),
    onSuccess: (newComment) => {
      queryClient.setQueriesData(
        { queryKey: ["comments", newComment.postId] },
        (prevResponse: CommentResponse): CommentResponse => {
          if (!prevResponse) return prevResponse

          return {
            ...prevResponse,
            comments: [...prevResponse.comments, { ...newComment, likes: 0 }],
            total: prevResponse.total + 1,
          }
        },
      )
    },
  })
}
