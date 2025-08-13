import type { CommentFilter } from "@/entities/comment/model/types"

export const COMMENT_QUERY_KEYS = {
  all: ["comments"] as const,
  lists: () => [...COMMENT_QUERY_KEYS.all, "list"] as const,
  list: (postId: number, filters?: CommentFilter) => [...COMMENT_QUERY_KEYS.lists(), postId, filters] as const,
  details: () => [...COMMENT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...COMMENT_QUERY_KEYS.details(), id] as const,
  user: (userId: number, filters?: CommentFilter) => [...COMMENT_QUERY_KEYS.all, "user", userId, filters] as const,
} as const
