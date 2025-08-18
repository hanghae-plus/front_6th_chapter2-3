import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment, ICommentRequest } from '@entities/comment'

export function useAddCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ICommentRequest) => addComment(payload),
    onSuccess: (data) => {
      // data에는 API 응답으로 postId가 포함되어야 함
      // dummyjson은 응답에 전달된 postId를 그대로 반환함
      // 타입을 명확히 하기 위해 any 캐스팅 대신 반환 타입을 보완할 수 있음
      const postId = (data as unknown as { postId: number }).postId
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] })
      }
    },
  })
}
