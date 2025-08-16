import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model"
import { createComment } from "@/entities/comment/api"
import { Comment, CreateComment, CommentPaginatedResponse } from "@/entities/comment/model"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onMutate: async (variables: CreateComment) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: commentKeys.listByPost(variables.postId),
      })

      // 이전 데이터 백업
      const previous = queryClient.getQueryData<CommentPaginatedResponse>(commentKeys.listByPost(variables.postId))

      // 낙관적 업데이트: 즉시 UI에 댓글 추가
      queryClient.setQueryData(
        commentKeys.listByPost(variables.postId),
        (old: CommentPaginatedResponse | undefined) => {
          if (!old) return old

          const optimisticComment: Comment = {
            id: Date.now(), // 임시 ID (number 타입)
            body: variables.body,
            postId: variables.postId,
            user: {
              id: variables.userId,
              username: "사용자",
              fullName: "사용자", // fullName 필드 추가
            },
            likes: 0,
          }

          return {
            ...old,
            comments: [...old.comments, optimisticComment],
            total: old.total + 1,
          }
        },
      )

      return { previous }
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.listByPost(variables.postId), context.previous)
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 쿼리 무효화하여 최신 데이터 동기화
      // queryClient.invalidateQueries({ queryKey: commentKeys.base() })
    },
  })
}
