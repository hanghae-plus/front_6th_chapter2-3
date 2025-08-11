import { z } from "zod"

export const commentSchema = z.object({
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

export type CommentSchema = z.infer<typeof commentSchema>
