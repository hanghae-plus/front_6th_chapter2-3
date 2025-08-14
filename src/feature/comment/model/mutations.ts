import { useMutation, useQueryClient } from "@tanstack/react-query"
import { requestApi } from "../../../shared/lib"
import { DeleteComment, NewComment, UpsertComment } from "../type"
import { QUERY_KEYS } from "../../../shared/constants/query"
import { useCommentStore } from "./store"

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId, currentLikes }: { id: number; postId: number; currentLikes: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PATCH",
        body: { likes: currentLikes + 1 },
      })

      if (!result || !data) {
        throw new Error("댓글 좋아요에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ id, postId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.getComments(postId) })
      const previousComments = queryClient.getQueryData(QUERY_KEYS.getComments(postId))

      queryClient.setQueryData(QUERY_KEYS.getComments(postId), (old: any) =>
        old?.map((comment: any) => (comment.id === id ? { ...comment, likes: (comment.likes ?? 0) + 1 } : comment)),
      )

      return { previousComments, id, postId }
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.getComments(context.postId), context.previousComments)
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getComments(variables.postId) })
    },
  })
}

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()
  const { setNewComment, setShowAddCommentDialog } = useCommentStore()

  return useMutation({
    mutationFn: async ({ newComment, postId }: { newComment: NewComment; postId: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/add`, {
        method: "POST",
        body: { ...newComment, postId },
      })

      if (!result || !data) {
        throw new Error("댓글 추가에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ newComment, postId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.getComments(postId) })
      const previousComments = queryClient.getQueryData(QUERY_KEYS.getComments(postId))

      const optimisticComment = {
        id: Date.now(),
        body: newComment.body,
        postId: postId,
        likes: 0,
        user: {
          id: newComment.userId,
          username: "You",
          fullName: "Current User",
        },
      }

      queryClient.setQueryData(QUERY_KEYS.getComments(postId), (old: any) => [...(old || []), optimisticComment])

      return { previousComments, optimisticComment, postId }
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.getComments(context.postId), context.previousComments)
      }
    },
    onSuccess: () => {
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getComments(variables.postId) })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()
  const { setShowEditCommentDialog, setSelectedComment } = useCommentStore()

  return useMutation({
    mutationFn: async ({ id, body, postId }: { id: number; body: string; postId: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PUT",
        body: { body },
      })

      if (!result || !data) {
        throw new Error("댓글 수정에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ id, body, postId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.getComments(postId) })
      const previousComments = queryClient.getQueryData(QUERY_KEYS.getComments(postId))

      queryClient.setQueryData(QUERY_KEYS.getComments(postId), (old: any) =>
        old?.map((comment: any) => (comment.id === id ? { ...comment, body } : comment)),
      )

      return { previousComments, id, postId }
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.getComments(context.postId), context.previousComments)
      }
    },
    onSuccess: () => {
      setShowEditCommentDialog(false)
      setSelectedComment(null)
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getComments(variables.postId) })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      const { result } = await requestApi<DeleteComment>(`/api/comments/${id}`, {
        method: "DELETE",
      })

      if (!result) {
        throw new Error("댓글 삭제에 실패했습니다")
      }

      return { deletedId: id, postId }
    },
    onMutate: async ({ id, postId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.getComments(postId) })
      const previousComments = queryClient.getQueryData(QUERY_KEYS.getComments(postId))

      queryClient.setQueryData(QUERY_KEYS.getComments(postId), (old: any) =>
        old?.filter((comment: any) => comment.id !== id),
      )

      return { previousComments, id, postId }
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.getComments(context.postId), context.previousComments)
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getComments(variables.postId) })
    },
  })
}
