import { userSchema } from "./schema"

import { z } from "zod"

export const getUsersResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  users: z.array(userSchema),
})
