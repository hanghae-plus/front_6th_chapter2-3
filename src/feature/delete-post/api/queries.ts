import { useMutation, useQueryClient } from "@tanstack/react-query"

import { postApi, PostsResponse } from "@/entities/post"

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postApi.delete,
    onSuccess: (deletedPost) => {
      queryClient.setQueriesData({ queryKey: ["posts-with-users"] }, (prevResponse: PostsResponse): PostsResponse => {
        if (!prevResponse) return prevResponse
        return {
          ...prevResponse,
          posts: prevResponse.posts.filter((post) => post.id !== deletedPost.id),
        }
      })
    },
  })
}
