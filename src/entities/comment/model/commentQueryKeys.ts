// Query Keys
export const commentKeys = {
  all: ["comments"],
  lists: () => [...commentKeys.all, "list"],
  list: (postId: number) => [...commentKeys.lists(), postId],
  details: () => [...commentKeys.all, "detail"],
  detail: (id: number) => [...commentKeys.details(), id],
} as const
