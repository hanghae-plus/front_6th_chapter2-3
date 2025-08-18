import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IComment, likeComment } from '@entities/comment'

export function useLikeCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      await likeComment(id, likes)
      return { id, likes: likes + 1, postId }
    },
    onMutate: async ({ id, likes, postId }) => {
      console.log('Like comment mutation started:', { id, likes, postId })
      
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })

      // 이전 데이터 백업
      const previousComments = queryClient.getQueryData<IComment[]>(['comments', postId])
      console.log('Previous comments:', previousComments)

      // 낙관적 업데이트: 즉시 UI 업데이트
      queryClient.setQueryData<IComment[]>(['comments', postId], (prev) => {
        if (!prev) return prev
        const updated = prev.map((comment) => (comment.id === id ? { ...comment, likes: likes + 1 } : comment))
        console.log('Optimistically updated comments:', updated)
        return updated
      })

      // 롤백을 위한 이전 데이터 반환
      return { previousComments, postId }
    },
    onError: (error, variables, context) => {
      console.error('댓글 좋아요 오류:', error)

      // 실패 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', context.postId], context.previousComments)
      }
    },
    onSettled: (data, error, variables) => {
      // 성공/실패 관계없이 최신 데이터로 다시 fetch
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
    },
  })
}
