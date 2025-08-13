import { normalize } from "@/shared/lib/normalizeParams"
import type { CommentFilter } from "@/shared/types/comment.type"

export const COMMENT_QK = {
  base: () => ["comments"] as const,
  list: (p: CommentFilter) => [...COMMENT_QK.base(), "list", normalize(p as Record<string, unknown>)] as const,
  detail: (id: number) => [...COMMENT_QK.base(), "detail", id] as const,
}
