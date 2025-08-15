export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", { postId }] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: number) => [...commentKeys.details(), id] as const,
} as const
