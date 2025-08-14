import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost as createPostApi } from "@/features/post/create-post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { Post, PostPaginatedResponse } from "@/shared/types"

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const {
    mutate: createPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: createPostApi,
    onSuccess: (newPost: Post) => {
      queryClient.setQueriesData({ queryKey: POST_QK.list({}) }, (old: PostPaginatedResponse) => {
        return {
          ...old,
          posts: [...old.posts, newPost],
          total: old.total + 1,
        }
      })
    },
  })
  return { createPost, isPending, error }
}
