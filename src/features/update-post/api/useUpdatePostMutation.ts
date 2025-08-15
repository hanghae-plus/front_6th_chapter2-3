import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updatePost } from "@/entities/post/api/posts"
import type { UpdatePost } from "@/entities/post/model"

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePost.Payload) => updatePost(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.setQueryData(["posts", variables.id], data)

      // 즉시 UI 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent("refreshPosts"))
    },
    onError: (error) => {
      console.error("Post 수정 실패:", error)
    },
  })
}
