export const commentQueryKeys = {
  all: ["comments"],
  list: (postId?: number) => [...commentQueryKeys.all, postId],
}
