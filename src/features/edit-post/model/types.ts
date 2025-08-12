export interface EditPostFormData {
  title: string
  body: string
}

export interface EditPostCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}
