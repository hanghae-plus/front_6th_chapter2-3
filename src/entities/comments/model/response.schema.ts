
import { commentSchema } from "./schema"

import { z } from "zod"

export const getCommentsByPostIdResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  comments: z.array(commentSchema),
})

export const addCommentResponseSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
  }),
})

export const updateCommentResponseSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  likes: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
  }),
})

export const deleteCommentResponseSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  likes: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
  }),
  isDeleted: z.boolean(),
  deletedOn: z.string(),
})

export const patchCommentResponseSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  likes: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
  }),
})
