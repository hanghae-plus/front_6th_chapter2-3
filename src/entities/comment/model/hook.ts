/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCommentsByPost,
  getCommentsByUser,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} from "@/entities/comment/api"
import { COMMENT_QUERY_KEYS } from "@/entities/comment/model/query-key"
import { Comment, CommentFilter, UpdateComment } from "@/entities/comment/model/types"

// 특정 게시물의 댓글 목록 조회 훅
export const useCommentsByPost = (postId: number, filters?: CommentFilter) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.list(postId, filters),
    queryFn: () => getCommentsByPost(postId, filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!postId,
  })
}

// 특정 사용자의 댓글 목록 조회 훅
export const useCommentsByUser = (userId: number, filters?: CommentFilter) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.user(userId, filters),
    queryFn: () => getCommentsByUser(userId, filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!userId,
  })
}

// 댓글 생성 뮤테이션
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      // 해당 게시물의 댓글 목록을 업데이트
      queryClient.setQueryData(
        COMMENT_QUERY_KEYS.list(newComment.postId),
        (
          oldData: { comments: Comment[]; total: number; skip: number; limit: number; hasMore: boolean } | undefined,
        ) => {
          if (!oldData) return { comments: [newComment], total: 1, skip: 0, limit: 10, hasMore: false }
          return {
            ...oldData,
            comments: [newComment, ...oldData.comments],
            total: oldData.total + 1,
          }
        },
      )

      // 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.lists() })
    },
  })
}

// 댓글 수정 뮤테이션
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComment }) => updateComment(id, data),
    onSuccess: (updatedComment) => {
      // 해당 댓글이 속한 게시물의 댓글 목록을 업데이트
      queryClient.setQueriesData(
        { queryKey: COMMENT_QUERY_KEYS.lists() },
        (oldData: { comments: Comment[] } | undefined) => {
          if (!oldData?.comments) return oldData
          return {
            ...oldData,
            comments: oldData.comments.map((comment: Comment) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          }
        },
      )

      // 댓글 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.detail(updatedComment.id) })
    },
  })
}

// 댓글 삭제 뮤테이션
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, { id, postId }) => {
      // 해당 게시물의 댓글 목록에서 삭제된 댓글 제거
      queryClient.setQueryData(
        COMMENT_QUERY_KEYS.list(postId),
        (oldData: { comments: Comment[]; total: number } | undefined) => {
          if (!oldData?.comments) return oldData
          return {
            ...oldData,
            comments: oldData.comments.filter((comment: Comment) => comment.id !== id),
            total: oldData.total - 1,
          }
        },
      )

      // 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.lists() })
    },
  })
}

// 댓글 좋아요 뮤테이션
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => likeComment(id),
    onSuccess: (_, { id, postId }) => {
      // 해당 게시물의 댓글 목록에서 좋아요 수 업데이트
      queryClient.setQueryData(COMMENT_QUERY_KEYS.list(postId), (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData?.comments) return oldData
        return {
          ...oldData,
          comments: oldData.comments.map((comment: Comment) =>
            comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        }
      })
    },
  })
}

// 댓글 싫어요 뮤테이션
export const useDislikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) => dislikeComment(id),
    onSuccess: (_, { id, postId }) => {
      // 해당 게시물의 댓글 목록에서 싫어요 수 업데이트
      queryClient.setQueryData(COMMENT_QUERY_KEYS.list(postId), (oldData: { comments: Comment[] } | undefined) => {
        if (!oldData?.comments) return oldData
        return {
          ...oldData,
          comments: oldData.comments.map((comment: Comment) =>
            comment.id === id ? { ...comment, dislikes: comment.dislikes + 1 } : comment,
          ),
        }
      })
    },
  })
}
