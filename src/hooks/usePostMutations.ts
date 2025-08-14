import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPost, updatePost, deletePost } from "../entities/post/api"
import type { Post } from "../entities/post/model"

export const usePostMutations = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] })
  }

  const addPostMutation = useMutation({
    mutationFn: (newPost: { title: string; body: string; userId: number }) => addPost(newPost),
    onSuccess,
  })

  const updatePostMutation = useMutation({
    mutationFn: (variables: { postId: number; postData: Partial<Post> }) =>
      updatePost(variables.postId, variables.postData),
    onSuccess,
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess,
  })

  return {
    addPost: addPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
  }
}
