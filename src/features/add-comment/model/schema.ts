import { z } from "zod"

export const addCommentFormSchema = z.object({
  postId: z.number(),
  body: z.string().min(1, "내용을 입력해주세요"),
  userId: z.number().default(1),
})

export type AddCommentFormValues = z.infer<typeof addCommentFormSchema>
