import { z } from "zod"
import { userSchema } from "./schema"

export const getUsersResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  users: z.array(userSchema),
})
