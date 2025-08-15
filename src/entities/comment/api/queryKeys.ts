export const commentQueryKeys = {
  all: ["comments"] as const,
  lists: () => [...commentQueryKeys.all, "list"] as const,
  list: (postId: number) => [...commentQueryKeys.lists(), { postId }] as const,
  details: () => [...commentQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...commentQueryKeys.details(), id] as const,
} as const;
