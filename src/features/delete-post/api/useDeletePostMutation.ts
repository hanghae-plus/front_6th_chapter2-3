import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deletePost } from "@/entities/post/api/posts"
import type { DeletePost } from "@/entities/post/model"

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeletePost.Payload) => deletePost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
