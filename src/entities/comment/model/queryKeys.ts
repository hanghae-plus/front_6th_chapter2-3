export const commentQueryKeys = {
  all: ["comments"] as const,
  list: (postId: number) => [...commentQueryKeys.all, "list", {postId}] as const,
  detail: (id: number) => [...commentQueryKeys.all, "detail", id] as const,
}