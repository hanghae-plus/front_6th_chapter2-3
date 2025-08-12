import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, deleteComment, likeComment, updateComment } from "@entities/comment"
import type { NewComment, Comment } from "@entities/comment"
import { updateQueriesWithRollback } from "@shared/lib"

type CommentsListData = { comments: Comment[] }

const buildTempComment = (c: NewComment & { postId: number }): Comment => ({
  id: -Date.now(),
  body: c.body,
  postId: c.postId,
  userId: c.userId,
  likes: 0,
  user: { id: c.userId, username: "You" },
})

export const usePostComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comment: NewComment) => addComment(comment),
    onMutate: async (variables: NewComment) => {
      if (variables.postId == null) return { rollback: () => {} }
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] })
      const pairs = queryClient.getQueriesData<CommentsListData>({ queryKey: ["comments", variables.postId] })
      const temp = buildTempComment(variables as NewComment & { postId: number })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) => ({
        ...prev,
        comments: [...(prev?.comments || []), temp],
      }))
      return { rollback }
    },
    onError: (_e, _v, ctx) => ctx?.rollback?.(),
    onSettled: (_d, _e, variables) => {
      if (variables?.postId != null) {
        queryClient.invalidateQueries({ queryKey: ["comments", variables.postId], refetchType: "active" })
      }
    },
  })
}

export const usePutComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string; postId: number }) => updateComment(id, body),
    onMutate: async (variables: { id: number; body: string; postId: number }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] })
      const pairs = queryClient.getQueriesData<CommentsListData>({ queryKey: ["comments", variables.postId] })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) => ({
        ...prev,
        comments: (prev?.comments || []).map((c) => (c.id === variables.id ? { ...c, body: variables.body } : c)),
      }))
      return { rollback }
    },
    onError: (_e, _v, ctx) => ctx?.rollback?.(),
    onSettled: (_d, _e, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId], refetchType: "active" })
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onMutate: async (variables: { id: number; postId: number }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] })
      const pairs = queryClient.getQueriesData<CommentsListData>({ queryKey: ["comments", variables.postId] })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) => ({
        ...prev,
        comments: (prev?.comments || []).filter((c) => c.id !== variables.id),
      }))
      return { rollback }
    },
    onError: (_e, _v, ctx) => ctx?.rollback?.(),
    onSettled: (_d, _e, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId], refetchType: "active" })
    },
  })
}

export const usePatchCommentLikes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentLikes }: { id: number; postId: number; currentLikes: number }) =>
      likeComment(id, currentLikes),
    onMutate: async (variables: { id: number; postId: number; currentLikes: number }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] })
      const pairs = queryClient.getQueriesData<CommentsListData>({ queryKey: ["comments", variables.postId] })
      const rollback = updateQueriesWithRollback(queryClient, pairs, (prev) => ({
        ...prev,
        comments: (prev?.comments || []).map((c) =>
          c.id === variables.id ? { ...c, likes: variables.currentLikes + 1 } : c,
        ),
      }))
      return { rollback }
    },
    onError: (_e, _v, ctx) => ctx?.rollback?.(),
    onSettled: (_d, _e, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId], refetchType: "active" })
    },
  })
}
