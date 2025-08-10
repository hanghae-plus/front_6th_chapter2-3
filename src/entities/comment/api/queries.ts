import { queryOptions } from "@tanstack/react-query"
import { commentApi } from "./api"

export const commentQueries = {
  all: () => ["comments"] as const,
  byPost: (postId: number) => [...commentQueries.all(), "byPost", postId] as const,
  byPostQuery: (postId: number) =>
    queryOptions({
      queryKey: commentQueries.byPost(postId),
      queryFn: () => commentApi.getComments(postId),
      enabled: !!postId,
    }),
}
