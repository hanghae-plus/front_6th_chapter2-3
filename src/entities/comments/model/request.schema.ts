import { z } from "zod"
import { commentSchema } from "./schema"

export const getCommentsByPostIdRequestParamsSchema = z.object({
  postId: z.number(),
})

export const addCommentRequestSchema = commentSchema.pick({
  title: true,
  body: true,
  userId: true,
})

export const updateCommentRequestSchema = commentSchema.pick({
  id: true,
  body: true,
})

export const deleteCommentRequestSchema = z.object({
  id: z.number(),
})

export const likeCommentRequestSchema = z.object({
  id: z.number(),
  likes: z.number(),
})
