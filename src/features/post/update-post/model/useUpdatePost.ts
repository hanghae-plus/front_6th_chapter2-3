import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost as updatePostApi } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { Post, PostPaginatedResponse, UpdatePost } from "@/entities/post/model/types"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const {
    mutate: updatePost,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePostApi(id, data),
    onSuccess: (updatedPost: Post) => {
      queryClient.setQueriesData({ queryKey: POST_QK.list({}) }, (prev: PostPaginatedResponse) => {
        return {
          ...prev,
          posts: prev.posts.map((p: Post) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
        }
      })
    },
  })

  return { updatePost, isPending, error }
}
