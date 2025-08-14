import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CommentAPI from "../api/CommentAPI"
import { CreateComment, UpdateComment } from "./types"

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => CommentAPI.getComments(postId),
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CreateComment) => CommentAPI.createComment(comment),
    onSuccess: (_, variables) => {
      // 댓글 추가 후 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment, postId }: { id: number; comment: UpdateComment; postId: number }) =>
      CommentAPI.updateComment(id, comment),
    onSuccess: (_, variables) => {
      // 댓글 수정 후 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => CommentAPI.deleteComment(id),
    onSuccess: () => {
      // 댓글 삭제 후 모든 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => CommentAPI.likeComment(id),
    onSuccess: () => {
      // 댓글 좋아요 후 모든 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}
