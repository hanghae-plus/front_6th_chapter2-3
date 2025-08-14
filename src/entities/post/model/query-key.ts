import { normalize, BaseQueryParams } from "@/shared/lib"

export const POST_QK = {
  base: () => ["posts"] as const,
  all: () => [...POST_QK.base(), "all"] as const,
  list: (baseParams: BaseQueryParams) =>
    [...POST_QK.base(), "list", normalize(baseParams as Record<string, unknown>)] as const,
  detail: (id: number) => [...POST_QK.base(), "detail", id] as const,
  tags: () => [...POST_QK.base(), "tags"] as const,
} as const
