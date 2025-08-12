import { useState, useEffect } from "react"
import { usePostPost } from "@entities/post"
import type { AddPostFormData, AddPostCallbacks } from "./types"

export const useAddPostForm = (open: boolean) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState(1)

  const createPostMutation = usePostPost()

  // 폼 초기화 (다이얼로그가 열릴 때)
  useEffect(() => {
    if (open) {
      setTitle("")
      setBody("")
      setUserId(1)
    }
  }, [open])

  const formData: AddPostFormData = { title, body, userId }
  
  const formActions = {
    setTitle,
    setBody,
    setUserId,
  }

  const handleSubmit = (callbacks: AddPostCallbacks) => {
    createPostMutation.mutate(formData, {
      onSuccess: callbacks.onSuccess,
      onError: callbacks.onError,
    })
  }

  return {
    formData,
    formActions,
    handleSubmit,
    isLoading: createPostMutation.isPending,
  }
}