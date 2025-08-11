import { z } from "zod"
import { postSchema, tagSchema } from "./schema"

export const getPostsResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  posts: z.array(postSchema),
})

export const getPostTagsResponseSchema = z.array(tagSchema)

export const addPostResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
})
