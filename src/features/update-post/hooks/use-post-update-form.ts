import { useForm } from "@/shared/hooks"
import { z } from "zod"
import { postFormSchema, PostFormValues } from "../model"

const INITIAL_POST_FORM_VALUES: PostFormValues = {
  title: "",
  body: "",
  userId: 1,
}

const validatePostForm = (values: PostFormValues) => {
  try {
    postFormSchema.parse(values)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: z.core.$ZodIssue) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return errors
    }
    return null
  }
}

export const usePostUpdateForm = (initialValues?: Partial<PostFormValues>) => {
  const form = useForm({
    initialValues: { ...INITIAL_POST_FORM_VALUES, ...initialValues },
    validate: validatePostForm,
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
