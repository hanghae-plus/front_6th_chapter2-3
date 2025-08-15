import { useCallback, useState } from "react"

export interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Record<string, string> | null
}

export interface UseFormReturn<T> {
  values: T
  errors: Record<string, string>
  isValid: boolean
  setValue: (field: keyof T, value: T[keyof T]) => void
  setValues: (values: Partial<T>) => void
  setFieldValues: (values: T) => void
  resetForm: () => void
  validateForm: () => boolean
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setFormValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setFormValues((prev) => ({ ...prev, [field]: value }))

      // 개별 필드 변경 시 해당 필드 에러 제거
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field as string]
          return newErrors
        })
      }
    },
    [errors],
  )

  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues((prev) => ({ ...prev, ...newValues }))
  }, [])

  const setFieldValues = useCallback((newValues: T) => {
    setFormValues(newValues)
  }, [])

  const resetForm = useCallback(() => {
    setFormValues(initialValues)
    setErrors({})
  }, [initialValues])

  const validateForm = useCallback(() => {
    if (!validate) return true

    const validationErrors = validate(values)
    if (validationErrors) {
      setErrors(validationErrors)
      return false
    }

    setErrors({})
    return true
  }, [validate, values])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    isValid,
    setValue,
    setValues,
    setFieldValues,
    resetForm,
    validateForm,
  }
}
