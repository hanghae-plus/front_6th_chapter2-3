import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost as createPostApi } from "@/entities/post/api"
import { getUserById } from "@/entities/user/api"
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
      const newPost = await createPostApi(data)

      if (!data.author && newPost.userId) {
        try {
          const author = await getUserById(newPost.userId)
          return { ...newPost, author } as PostWithAuthor
        } catch (error) {
          console.warn("사용자 정보를 가져올 수 없습니다:", error)
          return newPost
        }
      }

      return { ...newPost, author: data.author } as PostWithAuthor
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
