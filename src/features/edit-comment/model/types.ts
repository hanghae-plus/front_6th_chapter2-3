export interface EditCommentFormData {
  body: string
}

export interface EditCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}
