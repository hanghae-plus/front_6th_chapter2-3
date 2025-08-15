import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Comment, Comments, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from "./types"
import { commentQueryKeys } from "./queryKeys.ts"
import { createComment, deleteComment, getComments, updateComment } from "../api/api"

// query
export const useGetCommentsQuery = (postId: number) =>{

  return useQuery<CommentsResponse>({
    queryKey: commentQueryKeys.list(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId
  })
}

// mutation
// TODO 낙관적 업데이트
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentRequest) => createComment(payload),
    onSuccess: (response) => {
      if(!response.postId) return
      queryClient.setQueryData<Comments>(commentQueryKeys.list(response.postId), (old) =>
        old ? { ...old, comments: [response, ...old.comments], total: (old.total ?? 0) + 1 } : old)
    }
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCommentRequest ) => updateComment(payload.id, { body: payload.body }),

    onSuccess: (response, { id }) => {
    queryClient.setQueryData<Comments>(commentQueryKeys.list(id), (old) => {

        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((comment) => (comment.id === response.id ? response : comment)),
        }
      })
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_res, { postId, id }) => {
      queryClient.setQueryData<CommentsResponse>(
        commentQueryKeys.list(postId),
        (old) => {
          if (!old) return old
          return {
            ...old,
            comments: old.comments.filter((comment) => comment.id !== id),
            total: Math.max(0, (old.total ?? 0) - 1),
          }
        }
      )
  })

}