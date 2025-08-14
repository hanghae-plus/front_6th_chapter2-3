import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../api/index"
import { CreateCommentRequest, UpdateComment } from "./types"
import { commentKeys } from "./commentQueryKeys"

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => commentApi.getCommentsByPost(postId),
    enabled: !!postId,
  })
}

// 댓글 추가
export const useAddComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (newComment: CreateCommentRequest) => commentApi.addComment(newComment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.all })
    },
  })
}

// 댓글 수정
export const useUpdateComment = (postId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updateData }: { id: number; updateData: UpdateComment }) =>
      commentApi.updateComment(id, updateData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
  })
}

// 댓글 삭제
export const useDeleteComment = (postId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId }: { commentId: number }) => commentApi.deleteComment(commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
  })
}

// 댓글 좋아요
export const useLikeComment = (postId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => commentApi.likeComment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.list(postId) })
    },
  })
}
