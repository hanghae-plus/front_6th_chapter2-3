import { queryOptions } from "@tanstack/react-query"
import { commentKeys } from "./query-key"
import { getCommentsByPost, getComment } from "../api"
import { CommentFilter } from "./types"

export const commentQueries = {
  listByPost: (postId: number, filters: CommentFilter = {}) =>
    queryOptions({
      queryKey: commentKeys.listByPost(postId, filters),
      queryFn: () => getCommentsByPost(postId),
      enabled: !!postId,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: commentKeys.detail(id),
      queryFn: () => getComment(id),
      enabled: !!id,
    }),
}
