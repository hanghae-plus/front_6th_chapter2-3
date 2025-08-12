import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, likeComment, updateComment } from "@entities/comment"
import type { NewComment } from "@entities/comment"

export const usePostComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comment: NewComment) => addComment(comment),
    onSuccess: (_data, variables) => {
      if (variables.postId != null) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] })
      }
    },
  })
}

export const usePutComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => updateComment(id, body),
    onSuccess: (_data, variables: { id: number; body: string; postId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteComment(id),
    onSuccess: (_data, variables: { id: number; postId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}

export const usePatchCommentLikes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentLikes }: { id: number; currentLikes: number }) => likeComment(id, currentLikes),
    onSuccess: (_data, variables: { id: number; postId: number; currentLikes: number }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
