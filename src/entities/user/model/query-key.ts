export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters: { limit?: number; skip?: number; select?: string }) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_QUERY_KEYS.details(), id] as const,
}
