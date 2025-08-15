import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Post, postApi, PostsResponse } from "@/entities/post"

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newPost: Pick<Post, "body" | "title" | "userId">) => postApi.create(newPost),
    onSuccess: (newPost) => {
      queryClient.setQueriesData({ queryKey: ["posts-with-users"] }, (prevResponse: PostsResponse) => {
        if (!prevResponse) return prevResponse
        return {
          posts: [newPost, ...prevResponse.posts],
          total: prevResponse.total + 1,
        }
      })
    },
  })
}
