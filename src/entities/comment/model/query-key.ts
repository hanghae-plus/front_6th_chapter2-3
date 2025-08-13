import { normalize } from "@/shared/lib/normalizeParams"

export const commentKeys = {
  base: () => ["comments"] as const,
  all: () => [...commentKeys.base(), "all"] as const,
  listByPost: (postId: number, filters?: { orderBy?: "latest" | "top"; skip?: number; limit?: number }) =>
    [...commentKeys.base(), "byPost", postId, normalize(filters ?? {})] as const,
  detail: (id: number) => [...commentKeys.base(), "detail", id] as const,
} as const
