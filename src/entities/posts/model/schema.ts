import { z } from "zod"

export const postSchema = z.object({
  id: z.number(),
  reactions: z.object({ likes: z.number(), dislikes: z.number() }),
  tags: z.array(z.string()),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  views: z.number(),
})

export const tagSchema = z.object({
  name: z.string(),
  slug: z.string(),
  url: z.string(),
})

export type Post = z.infer<typeof postSchema>
export type Tag = z.infer<typeof tagSchema>
