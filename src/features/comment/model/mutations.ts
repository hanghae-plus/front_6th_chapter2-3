import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateComment, UpdateComment, CommentReaction } from "@/entities/comment/model/types"
import { COMMENT_QUERY_KEYS } from "@/entities/comment/model/query-key"
import { createComment, updateComment, deleteComment, updateCommentReaction, likeComment, dislikeComment } from "../api"

/**
 * 댓글 생성 뮤테이션 훅
 * @returns 댓글 생성 뮤테이션 객체
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateComment) => createComment(data),
    onSuccess: (newComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(newComment.postId) })

      // 사용자 댓글 목록 캐시도 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.user(newComment.userId) })
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error)
    },
  })
}

/**
 * 댓글 수정 뮤테이션 훅
 * @returns 댓글 수정 뮤테이션 객체
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComment }) => updateComment(id, data),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(updatedComment.postId) })

      // 사용자 댓글 목록 캐시도 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.user(updatedComment.userId) })
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error)
    },
  })
}

/**
 * 댓글 삭제 뮤테이션 훅
 * @returns 댓글 삭제 뮤테이션 객체
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(variables.postId) })
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error)
    },
  })
}

/**
 * 댓글 반응 업데이트 뮤테이션 훅
 * @returns 댓글 반응 업데이트 뮤테이션 객체
 */
export const useUpdateCommentReaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CommentReaction }) => updateCommentReaction(id, data),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(updatedComment.postId) })
    },
    onError: (error) => {
      console.error("댓글 반응 업데이트 실패:", error)
    },
  })
}

/**
 * 댓글 좋아요 뮤테이션 훅
 * @returns 댓글 좋아요 뮤테이션 객체
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => likeComment(id),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(updatedComment.postId) })
    },
    onError: (error) => {
      console.error("댓글 좋아요 실패:", error)
    },
  })
}

/**
 * 댓글 싫어요 뮤테이션 훅
 * @returns 댓글 싫어요 뮤테이션 객체
 */
export const useDislikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dislikeComment(id),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.list(updatedComment.postId) })
    },
    onError: (error) => {
      console.error("댓글 싫어요 실패:", error)
    },
  })
}
