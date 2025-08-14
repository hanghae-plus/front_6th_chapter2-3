import { normalize } from "@/shared/lib/normalizeParams"
import { PostOptions } from "./types"

export const POST_QK = {
  base: () => ["posts"] as const,
  all: () => [...POST_QK.base(), "all"] as const,
  list: (filters: PostOptions) => [...POST_QK.base(), "list", normalize(filters)] as const,
  detail: (id: number) => [...POST_QK.base(), "detail", id] as const,
  tags: () => [...POST_QK.base(), "tags"] as const,
} as const
