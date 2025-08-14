import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IComment, deleteComment } from '@entities/comment'

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await deleteComment(id)
      return { id, postId }
    },
    onMutate: async ({ id, postId }) => {
      console.log('Delete comment mutation started:', { id, postId })
      
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      
      // 이전 데이터 백업
      const previousComments = queryClient.getQueryData<IComment[]>(['comments', postId])
      console.log('Previous comments before delete:', previousComments)
      
      // 낙관적 업데이트: 즉시 댓글 목록에서 제거
      queryClient.setQueryData<IComment[]>(['comments', postId], (prev) => {
        if (!prev) return prev
        const filtered = prev.filter((comment) => comment.id !== id)
        console.log('Optimistically filtered comments:', filtered)
        return filtered
      })
      
      // 롤백을 위한 이전 데이터 반환
      return { previousComments, postId }
    },
    onError: (error, variables, context) => {
      console.error('댓글 삭제 오류:', error)
      
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
