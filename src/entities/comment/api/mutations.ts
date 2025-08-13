import { AddCommentRequest, commentApi } from "./api"
import { commentQueries } from "./queries"
import { mutationOptions } from "@tanstack/react-query"
import { queryClient } from "../../../shared/config/query-client"
import type { CommentItem } from "../model"

export const commentMutations = {
  addMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "add"] as const,
      mutationFn: (comment: AddCommentRequest) => commentApi.addComment(comment),
      onMutate: async (comment) => {
        const key = commentQueries.byPost(comment.postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)
        const tempId = Date.now() * -1
        const optimistic: CommentItem = {
          id: tempId,
          body: comment.body,
          postId: comment.postId,
          likes: 0,
          user: { username: `user-${comment.userId}` },
        }
        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: [optimistic, ...(old?.comments ?? [])],
          total: (old?.total ?? 0) + 1,
        }))
        return { previous, key, tempId }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
      },
      onSuccess: (created, _vars, ctx) => {
        if (!ctx) return
        queryClient.setQueryData(ctx.key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === ctx.tempId ? created : c)),
          total: old?.total ?? 0,
        }))
      },
    }),

  updateMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "update"] as const,
      mutationFn: ({ id, body }: { id: number; postId: number; body: string }) => commentApi.updateComment(id, body),
      onMutate: async ({ id, postId, body }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)
        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === id ? { ...c, body } : c)),
          total: old?.total ?? 0,
        }))
        return { previous, key }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
      },
      onSuccess: (updated, _vars, ctx) => {
        if (!ctx) return
        queryClient.setQueryData(ctx.key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === updated.id ? updated : c)),
          total: old?.total ?? 0,
        }))
      },
    }),

  deleteMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "delete"] as const,
      mutationFn: ({ id }: { id: number; postId: number }) => commentApi.deleteComment(id),
      onMutate: async ({ id, postId }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)
        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).filter((c) => c.id !== id),
          total: Math.max(0, (old?.total ?? 0) - 1),
        }))
        return { previous, key }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
      },
    }),

  likeMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "like"] as const,
      mutationFn: ({ id, likes }: { id: number; postId: number; likes: number }) => commentApi.likeComment(id, likes),
      onMutate: async ({ id, postId, likes }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)
        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === id ? { ...c, likes } : c)),
          total: old?.total ?? 0,
        }))
        return { previous, key }
      },

      onError: (_e, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous)
      },
    }),
}
