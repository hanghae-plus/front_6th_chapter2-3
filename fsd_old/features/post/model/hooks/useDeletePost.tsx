import { GetPostsResponse, Post, POSTS_QUERY_KEY } from "@entities/post"
import { http } from "@shared/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deletePost = async (id: number) => {
  const response: Post = await http.delete(`/posts/${id}`)

  return response
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation<Post, Error, number>({
    mutationFn: deletePost,
    onSuccess: (deletedPost) => {
      queryClient.setQueriesData({ queryKey: POSTS_QUERY_KEY.lists() }, (oldData: GetPostsResponse) => {
        if (!oldData?.posts) return oldData

        return {
          ...oldData,
          posts: oldData.posts.filter((post: Post) => post.id !== deletedPost.id),
        }
      })
    },
  })
}
