import { useState, useEffect } from "react"
import { usePostComment } from "@entities/comment"

// Types
export interface AddCommentFormData {
  body: string
  postId: number
  userId: number
}

export interface AddCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useAddCommentForm = (open: boolean, postId?: number) => {
  const [body, setBody] = useState("")

  const addCommentMutation = usePostComment()

  // 폼 초기화 (다이얼로그가 열릴 때)
  useEffect(() => {
    if (open) {
      setBody("")
    }
  }, [open])

  const formData: AddCommentFormData = {
    body,
    postId: postId || 0,
    userId: 1,
  }

  const formActions = {
    setBody,
  }

  const handleSubmit = (callbacks: AddCommentCallbacks) => {
    if (!postId) return

    addCommentMutation.mutate(formData, {
      onSuccess: callbacks.onSuccess,
      onError: callbacks.onError,
    })
  }

  return {
    formData,
    formActions,
    handleSubmit,
    isLoading: addCommentMutation.isPending,
    canSubmit: !!postId && body.trim().length > 0,
  }
}
