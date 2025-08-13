import type { PostFilter } from "@/shared/types"

export const POST_QUERY_KEYS = {
  all: ["posts"] as const,
  lists: () => [...POST_QUERY_KEYS.all, "list"] as const,
  list: (filters: PostFilter) => [...POST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...POST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POST_QUERY_KEYS.details(), id] as const,
  search: (query: string) => [...POST_QUERY_KEYS.lists(), "search", query] as const,
  tag: (tag: string) => [...POST_QUERY_KEYS.lists(), "tag", tag] as const,
}
