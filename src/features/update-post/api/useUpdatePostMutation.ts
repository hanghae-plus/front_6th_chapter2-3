import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updatePost } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { UpdatePost } from "@/entities/post/model"

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePost.Payload) => updatePost(payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(postKeys.detail(variables.id), data)
      queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: unknown) => {
        if (!old) return undefined
        const oldData = old as { posts: Array<{ id: number }>; total: number }
        return {
          ...oldData,
          posts: oldData.posts.map((post: unknown) => {
            const typedPost = post as { id: number }
            return typedPost.id === variables.id ? { ...typedPost, ...data } : post
          }),
        }
      })

      queryClient.setQueriesData({ queryKey: postKeys.all }, (old: unknown) => {
        if (!old) return old
        const oldData = old as { posts?: Array<{ id: number }> }
        if (!oldData.posts) return old

        return {
          ...oldData,
          posts: oldData.posts.map((post: unknown) => {
            const typedPost = post as { id: number }
            return typedPost.id === variables.id ? { ...typedPost, ...data } : post
          }),
        }
      })
    },
    onError: (error) => {
      console.error("Post 수정 실패:", error)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}
