export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), filters] as const,
  search: (payload: Record<string, unknown>) => [...postKeys.all, "search", payload] as const,
  searchByQuery: (query: string) => [...postKeys.all, "search", { query }] as const,
  byTag: (payload: Record<string, unknown>) => [...postKeys.all, "tag", payload] as const,
  byTagName: (tag: string) => [...postKeys.all, "tag", { tag }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
} as const

export const postTagKeys = {
  all: ["postTags"] as const,
  lists: () => [...postTagKeys.all, "list"] as const,
} as const
