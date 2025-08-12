import { commentSchema } from "./schema"

import { z } from "zod"

export const getCommentsByPostIdResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  comments: z.array(commentSchema),
})
