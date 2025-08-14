import { postSchema } from "./schema"

import { z } from "zod"

export const getPostsRequestParamsSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  skip: z.number().min(0).optional(),
  sortBy: z.enum(postSchema.pick({ id: true, title: true, reactions: true }).keyof().enum).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

export const addPostRequestSchema = postSchema.pick({
  title: true,
  body: true,
  userId: true,
})

export const updatePostRequestSchema = postSchema.partial()

export const deletePostRequestSchema = z.object({
  id: z.number(),
})

export const likePostRequestSchema = postSchema.pick({
  id: true,
})

export const dislikePostRequestSchema = postSchema.pick({
  id: true,
})
