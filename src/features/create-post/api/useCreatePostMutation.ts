import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addPost } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { AddPost } from "@/entities/post/model"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddPost.Payload) => addPost(payload),
    onSuccess: (data) => {
      const firstPageKey = postKeys.list({ limit: 10, skip: 0 })
      queryClient.setQueryData(firstPageKey, (old: unknown) => {
        if (!old) return undefined
        const oldData = old as { posts: unknown[]; total: number }
        return {
          ...oldData,
          posts: [data, ...oldData.posts.slice(0, 9)],
          total: oldData.total + 1,
        }
      })

      queryClient.setQueryData(postKeys.detail(data.id), data)
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
        exact: false,
        predicate: (query) => {
          const queryKey = query.queryKey as unknown[]
          return JSON.stringify(queryKey) !== JSON.stringify(firstPageKey)
        },
      })
    },
    onError: (error) => {
      console.error("Post 생성 실패:", error)
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}
