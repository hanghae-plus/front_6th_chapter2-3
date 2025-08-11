import { z } from "zod"
import { commentSchema } from "./schema"

export const getCommentsByPostIdResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  comments: z.array(commentSchema),
})
