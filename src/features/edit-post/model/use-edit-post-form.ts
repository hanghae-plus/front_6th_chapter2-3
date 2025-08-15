import { useState, useEffect } from "react"
import { usePutPost } from "@entities/post"
import type { Post } from "@entities/post"

// Types
export interface EditPostFormData {
  title: string
  body: string
}

export interface EditPostCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useEditPostForm = (initialPost?: Post | null, open?: boolean) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const editPostMutation = usePutPost()

  // 초기 데이터 설정 (다이얼로그가 열릴 때)
  useEffect(() => {
    if (!initialPost) return
    
    setTitle(initialPost.title || "")
    setBody(initialPost.body || "")
  }, [initialPost, open])

  const formData: EditPostFormData = { title, body }
  
  const formActions = {
    setTitle,
    setBody,
  }

  const handleSubmit = (callbacks: EditPostCallbacks) => {
    if (!initialPost) return
    
    editPostMutation.mutate(
      { id: initialPost.id, post: formData },
      {
        onSuccess: callbacks.onSuccess,
        onError: callbacks.onError,
      }
    )
  }

  return {
    formData,
    formActions,
    handleSubmit,
    isLoading: editPostMutation.isPending,
    hasInitialPost: !!initialPost,
  }
}