import { useState, useEffect } from "react"
import { usePutComment } from "@entities/comment"
import type { Comment } from "@entities/comment"

// Types
export interface EditCommentFormData {
  body: string
}

export interface EditCommentCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useEditCommentForm = (initialComment?: Comment | null, open?: boolean) => {
  const [body, setBody] = useState("")

  const editCommentMutation = usePutComment()

  // 초기 데이터 설정 (다이얼로그가 열릴 때)
  useEffect(() => {
    if (!initialComment) return

    setBody(initialComment.body || "")
  }, [initialComment, open])

  const formData: EditCommentFormData = { body }

  const formActions = {
    setBody,
  }

  const handleSubmit = (callbacks: EditCommentCallbacks) => {
    if (!initialComment) return

    editCommentMutation.mutate(
      {
        id: initialComment.id,
        body: formData.body,
        postId: initialComment.postId,
      },
      {
        onSuccess: callbacks.onSuccess,
        onError: callbacks.onError,
      },
    )
  }

  return {
    formData,
    formActions,
    handleSubmit,
    isLoading: editCommentMutation.isPending,
    hasInitialComment: !!initialComment,
    canSubmit: body.trim().length > 0,
  }
}
