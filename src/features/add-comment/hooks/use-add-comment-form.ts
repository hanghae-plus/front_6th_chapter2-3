import { useForm } from "@/shared/hooks"

import type { AddCommentFormValues } from "../model"
import { addCommentFormSchema } from "../model"

import { z } from "zod"

const INITIAL_COMMENT_FORM_VALUES: AddCommentFormValues = {
  postId: 0,
  body: "",
  userId: 1,
}

const validateCommentForm = (values: AddCommentFormValues) => {
  try {
    addCommentFormSchema.parse(values)
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

export const useAddCommentForm = (initialValues: Pick<AddCommentFormValues, "postId" | "userId">) => {
  const form = useForm({
    initialValues: { ...INITIAL_COMMENT_FORM_VALUES, ...initialValues },
    validate: validateCommentForm,
  })

  const setBody = (body: string) => form.setValue("body", body)
  const setUserId = (userId: number) => form.setValue("userId", userId)

  return {
    ...form,
    setBody,
    setUserId,
  }
}
