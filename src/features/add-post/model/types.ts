export interface AddPostFormData {
  title: string
  body: string
  userId: number
}

export interface AddPostCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}
