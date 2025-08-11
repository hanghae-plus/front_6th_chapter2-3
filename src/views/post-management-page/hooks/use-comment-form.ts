import { useForm } from "@/shared/hooks"
import { z } from "zod"

const commentFormSchema = z.object({
  body: z.string().min(1, "댓글 내용을 입력해주세요"),
  postId: z.number().nullable(),
  userId: z.number().nullable().default(1),
})

export type CommentFormValues = z.infer<typeof commentFormSchema>

const INITIAL_COMMENT_FORM_VALUES: CommentFormValues = {
  body: "",
  postId: null,
  userId: 1,
}

const validateCommentForm = (values: CommentFormValues) => {
  try {
    commentFormSchema.parse(values)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return errors
    }
    return null
  }
}

export const useCommentForm = (initialValues?: Partial<CommentFormValues>) => {
  const form = useForm({
    initialValues: { ...INITIAL_COMMENT_FORM_VALUES, ...initialValues },
    validate: validateCommentForm,
  })

  const setBody = (body: string) => form.setValue("body", body)
  const setPostId = (postId: number | null) => form.setValue("postId", postId)
  const setUserId = (userId: number) => form.setValue("userId", userId)

  return {
    ...form,
    setBody,
    setPostId,
    setUserId,
  }
}
