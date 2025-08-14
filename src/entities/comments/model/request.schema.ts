
import { commentSchema } from "./schema"

import { z } from "zod"

export const getCommentsByPostIdRequestParamsSchema = z.object({
  postId: z.number(),
})

export const addCommentRequestSchema = commentSchema.pick({
  body: true,
  postId: true,
}).extend({
  userId: z.number(),
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

export const dislikeCommentRequestSchema = z.object({
  id: z.number(),
  likes: z.number(),
})
