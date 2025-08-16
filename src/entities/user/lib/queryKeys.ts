export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (payload: Record<string, unknown>) => [...userKeys.details(), payload] as const,
  detailById: (id: number) => [...userKeys.details(), { id }] as const,
} as const
