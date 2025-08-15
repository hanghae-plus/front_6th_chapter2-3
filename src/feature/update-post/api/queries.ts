import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Post, postApi, PostsResponse } from "@/entities/post"

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedPost: Post) => postApi.update(updatedPost),
    onSuccess: (updatedPost) => {
      queryClient.setQueriesData({ queryKey: ["posts-with-users"] }, (prevResponse: PostsResponse) => {
        if (!prevResponse) return prevResponse
        return {
          ...prevResponse,
          posts: prevResponse.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
        }
      })
    },
  })
}
