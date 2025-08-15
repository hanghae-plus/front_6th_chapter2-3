import { z } from "zod"

export const getUsersRequestParamsSchema = z.object({
  limit: z.number().min(0).max(100).default(0),
  select: z.string().optional(),
})
