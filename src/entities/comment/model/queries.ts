import { queryOptions } from "@tanstack/react-query"
import type { CommentFilter } from "@/shared/types"
import { commentKeys } from "./query-key"
import { getCommentsByPost, getComment } from "../api"

export const commentQueries = {
  // 키만 쓰고 싶을 때를 위해 keys는 분리 유지
  keys: commentKeys,

  listByPost: (postId: number, filters: CommentFilter = {}) =>
    queryOptions({
      queryKey: commentKeys.listByPost(postId, filters),
      queryFn: () => getCommentsByPost(postId, filters),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      enabled: !!postId,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: commentKeys.detail(id),
      queryFn: () => getComment(id),
      staleTime: 10 * 60 * 1000, // 10분
      gcTime: 15 * 60 * 1000, // 15분
      enabled: !!id,
    }),
}
