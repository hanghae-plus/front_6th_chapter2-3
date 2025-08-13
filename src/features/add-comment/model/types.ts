export interface AddCommentFormData {
  body: string
  postId: number
  userId: number
}

export interface AddCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}