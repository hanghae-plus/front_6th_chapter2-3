import { z } from "zod"

export const postFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요"),
  userId: z.number().default(1),
})

export type PostFormValues = z.infer<typeof postFormSchema>
