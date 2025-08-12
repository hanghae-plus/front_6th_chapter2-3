import { useForm } from "@/shared/hooks"

import type { UpdateCommentFormValues } from "../model"
import { updateCommentFormSchema } from "../model"

import { z } from "zod"

const INITIAL_COMMENT_FORM_VALUES: UpdateCommentFormValues = {
  body: "",
  postId: null,
  userId: 1,
}

const validateCommentForm = (values: UpdateCommentFormValues) => {
  try {
    updateCommentFormSchema.parse(values)
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

export const useUpdateCommentForm = (initialValues?: Partial<UpdateCommentFormValues>) => {
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
