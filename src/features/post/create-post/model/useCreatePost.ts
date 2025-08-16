import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPostWithAuth } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model"
import { PostPaginatedResponse, PostWithAuthor, CreatePost } from "@/entities/post/model"
import { useBaseQueryParams } from "@/shared/hooks"

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const baseQueryParams = useBaseQueryParams()
  const {
    mutate: createPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: CreatePost) => {
      const newPost = await createPostWithAuth(data)
      return newPost
    },
    onSuccess: (newPost: PostWithAuthor) => {
      queryClient.setQueriesData(
        {
          queryKey: POST_QK.list({
            ...baseQueryParams,
          }),
        },
        (old: PostPaginatedResponse) => {
          if (!old) return old
          return {
            ...old,
            posts: [newPost, ...old.posts],
            total: old.total + 1,
          }
        },
      )
    },
  })
  return { createPost, isPending, error }
}
