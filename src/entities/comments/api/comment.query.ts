import { getCommentsByPostId } from "./comment.api"

import { queryOptions } from "@tanstack/react-query"

export const commentEntityQueries = {
  all: ["comments"] as const,
  getCommentsByPostIdKey: (postId: number) => [...commentEntityQueries.all, "getCommentsByPostId", postId] as const,
  getCommentsByPostId: (postId: number) =>
    queryOptions({
      queryKey: commentEntityQueries.getCommentsByPostIdKey(postId),
      queryFn: () => getCommentsByPostId({ postId }),
    }),
}
