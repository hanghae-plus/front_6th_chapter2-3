import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPost } from "@/entities/post/api/posts"
import type { AddPost } from "@/entities/post/model"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddPost.Payload) => addPost(payload),
    onSuccess: (data) => {
      // React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.setQueryData(["posts", data.id], data)
      
      // 즉시 UI 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent("refreshPosts"))
    },
    onError: (error) => {
      console.error("Post 생성 실패:", error)
    },
  })
}