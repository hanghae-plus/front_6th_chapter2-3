import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost as updatePostApi } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model"
import { Post, PostPaginatedResponse, UpdatePost } from "@/entities/post/model"
import { useBaseQueryParams } from "@/shared/hooks"

export const useUpdatePost = () => {
  const baseQueryParams = useBaseQueryParams()
  const queryClient = useQueryClient()
  const {
    mutate: updatePost,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePostApi(id, data),
    onSuccess: (updatedPost: Post) => {
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
            posts: old.posts.map((p: Post) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
          }
        },
      )
    },
  })

  return { updatePost, isPending, error }
}
