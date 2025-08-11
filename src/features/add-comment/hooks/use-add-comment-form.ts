import { useForm } from "@/shared/hooks"
import { z } from "zod"

import { addCommentFormSchema, AddCommentFormValues } from "../model"

const INITIAL_COMMENT_FORM_VALUES: AddCommentFormValues = {
  title: "",
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

export const useAddCommentForm = (initialValues?: AddCommentFormValues) => {
  const form = useForm({
    initialValues: { ...INITIAL_COMMENT_FORM_VALUES, ...initialValues },
    validate: validateCommentForm,
  })

  const setTitle = (title: string) => form.setValue("title", title)
  const setBody = (body: string) => form.setValue("body", body)
  const setUserId = (userId: number) => form.setValue("userId", userId)

  return {
    ...form,
    setTitle,
    setBody,
    setUserId,
  }
}
