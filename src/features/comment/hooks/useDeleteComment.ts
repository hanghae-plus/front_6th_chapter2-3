import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Comment } from "../../../entities/comment/model"
import { deleteComment } from "../../../entities/comment/api"
import { ListResponse } from "../../../shared/types/types"

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  const deleteCommentMutation = useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onMutate: async (ids: { id: number; postId: number }) => {
      const queryKey = ["comments", ids.postId]
      await queryClient.cancelQueries({ queryKey })
      const previousComments = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.filter((comment) => comment.id !== ids.id),
      }))
      return { queryKey, previousComments }
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.previousComments && ctx.queryKey) {
        queryClient.setQueryData(ctx.queryKey, ctx.previousComments)
      }
    },
  })

  return {
    action: {
      delete: deleteCommentMutation.mutate,
    },
  }
}
