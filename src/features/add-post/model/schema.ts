import { z } from "zod"

export const addPostFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요"),
  userId: z.number().default(1),
})

export type AddPostFormValues = z.infer<typeof addPostFormSchema>
