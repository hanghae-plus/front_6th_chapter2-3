import { queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getComment, getCommentsByPost } from "@/entities/comment/api"
import type { CommentFilter } from "@/shared/types"
import { normalize } from "@/shared/lib/normalizeParams"

// 댓글 관련 합성 쿼리
export const commentQueries = {
  // 특정 게시물의 댓글 목록 (with user info)
  listByPost: (postId: number, filters: CommentFilter = {}) =>
    queryOptions({
      queryKey: [...commentKeys.listByPost(postId, filters), "withUser", normalize({})],
      queryFn: async () => {
        return getCommentsByPost(postId, filters)
      },
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      enabled: !!postId,
      placeholderData: (previousData) => previousData,
    }),

  // 댓글 상세 정보
  detail: (id: number) =>
    queryOptions({
      queryKey: [...commentKeys.detail(id), "withUser", normalize({})],
      queryFn: async () => {
        return getComment(id)
      },
      staleTime: 10 * 60 * 1000, // 10분
      gcTime: 15 * 60 * 1000, // 15분
      enabled: !!id,
    }),
}
