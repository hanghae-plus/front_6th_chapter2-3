import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deletePost } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { DeletePost } from "@/entities/post/model"

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeletePost.Payload) => deletePost(payload),
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: unknown) => {
        if (!old) return undefined
        const oldData = old as { posts: Array<{ id: number }>; total: number }
        return {
          ...oldData,
          posts: oldData.posts.filter((post) => post.id !== variables.id),
          total: Math.max(0, oldData.total - 1),
        }
      })

      queryClient.removeQueries({ queryKey: postKeys.detail(variables.id) })
    },
    onError: (error) => {
      console.error("Post 삭제 실패:", error)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}
