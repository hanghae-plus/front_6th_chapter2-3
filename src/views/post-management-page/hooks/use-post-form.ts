import { useForm } from "@/shared/hooks"
import { z } from "zod"

const postFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요"),
  userId: z.number().default(1),
})

export type PostFormValues = z.infer<typeof postFormSchema>

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

export const usePostForm = (initialValues?: Partial<PostFormValues>) => {
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
