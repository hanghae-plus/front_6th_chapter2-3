import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likeComment } from "../../../entities/comment/api"
import { ListResponse } from "../../../shared/types/types"
import { Comment } from "../../../entities/comment/model"

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  /**
   * 댓글 좋아요 뮤테이션
   */
  const likeCommentMutation = useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => likeComment(id),
    onMutate: async (ids: { id: number; postId: number }) => {
      // 쿼리키 생성
      const queryKey = ["comments", ids.postId]
      await queryClient.cancelQueries({ queryKey })
      // 이전 댓글 데이터 가져오기
      const previousComments = queryClient.getQueryData(queryKey)
      // 댓글 데이터 업데이트
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) =>
          comment.id === ids.id ? { ...comment, likes: comment.likes + 1 } : comment,
        ),
      }))
      return { queryKey, previousComments }
    },
    onError: (_e, _vars, ctx) => {
      // 이전 댓글 데이터 복구
      if (ctx?.previousComments && ctx.queryKey) {
        queryClient.setQueryData(ctx.queryKey, ctx.previousComments)
      }
    },
  })

  return {
    action: {
      like: likeCommentMutation.mutate,
    },
  }
}
