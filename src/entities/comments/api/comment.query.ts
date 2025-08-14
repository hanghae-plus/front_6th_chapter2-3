import { createEntityQueries } from "@/shared/lib"

import { getCommentsByPostId } from "./comment.api"

const factory = createEntityQueries("comments")

const getCommentsByPostIdQuery = factory.build<number, Awaited<ReturnType<typeof getCommentsByPostId>>>("getCommentsByPostId", (postId) => getCommentsByPostId({ postId }))

export const commentEntityQueries = {
  all: factory.all,
  getCommentsByPostIdKey: getCommentsByPostIdQuery.getKey,
  getCommentsByPostId: getCommentsByPostIdQuery.getOptions,
}
