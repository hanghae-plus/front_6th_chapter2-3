import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query"
import { commentApi } from "./commentApi"
import { Comment, NewComment } from "../../../types"

// 댓글 추가
export const useAddComment = (options?: Omit<UseMutationOptions<Comment, Error, NewComment>, "mutationFn">) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentApi.addComment,
    onSuccess: (data) => {
      // 해당 게시물의 댓글 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    ...options,
  })
}

// 댓글 수정
export const useUpdateComment = (
  options?: Omit<UseMutationOptions<Comment, Error, { id: number; body: string }>, "mutationFn">,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => commentApi.updateComment(id, body),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    ...options,
  })
}

// 댓글 삭제
export const useDeleteComment = (
  options?: Omit<UseMutationOptions<void, Error, { id: number; postId: number }>, "mutationFn">,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => commentApi.deleteComment(id),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
    ...options,
  })
}

// 댓글 좋아요
export const useLikeComment = (
  options?: Omit<UseMutationOptions<Comment, Error, { id: number; likes: number }>, "mutationFn">,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) => commentApi.likeComment(id, likes),
    onSuccess: (data) => {
      // 해당 게시물의 댓글 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    ...options,
  })
}
