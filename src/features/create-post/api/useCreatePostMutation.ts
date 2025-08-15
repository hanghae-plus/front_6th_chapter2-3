import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPost } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { AddPost } from "@/entities/post/model"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddPost.Payload) => addPost(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.setQueryData(postKeys.detail(data.id), data)
    },
    onError: (error) => {
      console.error("Post 생성 실패:", error)
    },
  })
}
