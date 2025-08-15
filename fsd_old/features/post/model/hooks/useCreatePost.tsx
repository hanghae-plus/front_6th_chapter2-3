import { GetPostsResponse, POSTS_QUERY_KEY } from "@entities/post"
import { http } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface CreatePostBody {
  title: string
  body: string
  userId: number
}

const createPost = async (formData: CreatePostBody) => {
  const response = await http.post("/posts/add", formData)

  return response
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: (createdPost) => {
      queryClient.setQueriesData({ queryKey: POSTS_QUERY_KEY.lists() }, (oldData: GetPostsResponse) => {
        if (!oldData?.posts) return oldData

        return { ...oldData, posts: [createdPost, ...oldData.posts] }
      })
    },
  })
}
