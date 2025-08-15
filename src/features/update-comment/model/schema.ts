import { commentSchema } from "@/entities/comments"

import { z } from "zod"

export const updateCommentFormSchema = commentSchema
  .pick({
    body: true,
    postId: true,
    userId: true,
  })
  .extend({
    body: z.string().min(1, "댓글 내용을 입력해주세요"),
    postId: z.number().nullable(),
    userId: z.number().nullable().default(1),
  })

export type UpdateCommentFormValues = z.infer<typeof updateCommentFormSchema>
