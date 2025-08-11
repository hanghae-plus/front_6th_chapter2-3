import { z } from "zod"
import { postSchema } from "./schema"

export const getPostsRequestParamsSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  skip: z.number().min(0).default(0),
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
