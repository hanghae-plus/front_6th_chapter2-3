import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { createComment } from "@/entities/comment/api"
import type { Comment, CreateComment, CommentPaginatedResponse } from "@/shared/types"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: CreateComment) => {
      return createComment(comment)
    },
    onSuccess: (newComment: Comment, variables: CreateComment) => {
      // 댓글 목록 쿼리를 수동으로 업데이트
      queryClient.setQueriesData(
        { queryKey: commentKeys.listByPost(variables.postId) },
        (old: CommentPaginatedResponse | undefined) => {
          if (!old) return old
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
