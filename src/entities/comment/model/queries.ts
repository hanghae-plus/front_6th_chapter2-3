import { queryOptions } from "@tanstack/react-query"
import { commentKeys } from "./query-key"
import { getCommentsByPost, getComment } from "../api"
import { CommentFilter } from "./types"

export const commentQueries = {
  listByPost: (postId: number, filters: CommentFilter = {}) =>
    queryOptions({
      queryKey: commentKeys.listByPost(postId, filters),
      queryFn: () => getCommentsByPost(postId),
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
