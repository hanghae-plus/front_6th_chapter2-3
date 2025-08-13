import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createComment, updateComment, deleteComment, likeComment } from "@/features/comment/api"
import { commentKeys } from "@/entities/comment/model/query-key"
import type { CreateComment, UpdateComment } from "@/shared/types"

// 댓글 생성 뮤테이션
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CreateComment) => createComment(comment),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 목록 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.listByPost(data.postId, {}),
      })
    },
  })
}

// 댓글 수정 뮤테이션
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateComment }) => updateComment(id, updates),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 목록과 댓글 상세 정보 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.listByPost(data.postId, {}),
      })
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(data.id),
      })
    },
  })
}

// 댓글 삭제 뮤테이션
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      // 모든 댓글 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.base(),
      })
    },
  })
}

// 댓글 좋아요 뮤테이션
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) => likeComment(id, likes),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 목록과 댓글 상세 정보 무효화
      queryClient.invalidateQueries({
        queryKey: commentKeys.listByPost(data.postId, {}),
      })
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(data.id),
      })
    },
  })
}
