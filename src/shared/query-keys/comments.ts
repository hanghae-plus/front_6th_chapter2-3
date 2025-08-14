export const commentsKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentsKeys.all, "byPost", postId] as const,
  detail: (id: number) => [...commentsKeys.all, "detail", id] as const,
};
