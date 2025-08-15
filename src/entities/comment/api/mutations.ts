import { mutationOptions } from "@tanstack/react-query"
import { AddCommentRequest, commentApi } from "./api"
import { commentQueries } from "./queries"
import { queryClient } from "@shared/config/query-client"
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

        const tempId = -(Date.now() + Math.floor(Math.random() * 1000))

        const optimistic: CommentItem = {
          id: tempId,
          body: comment.body,
          postId: comment.postId,
          likes: 0,
          user: { username: `user-${comment.userId}` },
          isTemporary: true,
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

        queryClient.setQueryData(ctx.key, (old: { comments: CommentItem[]; total: number }) => {
          const comments = old?.comments ?? []
          const tempIndex = comments.findIndex((c) => c.id === ctx.tempId)

          if (tempIndex === -1) {
            return {
              comments: [{ ...created, likes: created.likes || 0 }, ...comments], // ✅ likes 기본값 보장
              total: old?.total ?? 1,
            }
          }

          const existingComment = comments.find((c) => c.id === created.id && c.id !== ctx.tempId)
          if (existingComment) {
            const updatedComment = { ...created, likes: created.likes || 0, id: ctx.tempId, isTemporary: true } // ✅ likes 기본값 보장
            return {
              comments: comments.map((c) => (c.id === ctx.tempId ? updatedComment : c)),
              total: old?.total ?? 0,
            }
          }

          return {
            comments: comments.map((c) =>
              c.id === ctx.tempId
                ? { ...created, likes: created.likes || 0, isTemporary: true } // ✅ likes 기본값 보장
                : c,
            ),
            total: old?.total ?? 0,
          }
        })
      },
    }),

  updateMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "update"] as const,
      mutationFn: async ({
        id,
        body,
        isTemporary,
      }: {
        id: number
        postId: number
        body: string
        isTemporary?: boolean
      }) => {
        if (id < 0 || isTemporary) {
          return { id, body, postId: 0, likes: 0, user: { username: "temp-user" }, isTemporary: true } as CommentItem
        }
        return commentApi.updateComment(id, body)
      },
      onMutate: async ({ id, postId, body, isTemporary }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)

        const currentComment = previous?.comments?.find((c) => c.id === id)
        const isCommentTemporary = isTemporary || currentComment?.isTemporary || id < 0

        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === id ? { ...c, body } : c)),
          total: old?.total ?? 0,
        }))

        return { previous, key, isTemporary: isCommentTemporary }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous && !ctx.isTemporary) {
          queryClient.setQueryData(ctx.key, ctx.previous)
        }
      },
      onSuccess: (updated, _vars, ctx) => {
        if (!ctx) return

        if (ctx.isTemporary) return

        queryClient.setQueryData(ctx.key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) =>
            c.id === updated.id
              ? { ...updated, likes: updated.likes || c.likes || 0 } // ✅ likes 보존/기본값 보장
              : c,
          ),
          total: old?.total ?? 0,
        }))
      },
    }),

  deleteMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "delete"] as const,
      mutationFn: async ({ id, isTemporary }: { id: number; postId: number; isTemporary?: boolean }) => {
        if (id < 0 || isTemporary) {
          return Promise.resolve()
        }
        return commentApi.deleteComment(id)
      },
      onMutate: async ({ id, postId, isTemporary }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)

        const currentComment = previous?.comments?.find((c) => c.id === id)
        const isCommentTemporary = isTemporary || currentComment?.isTemporary || id < 0

        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).filter((c) => c.id !== id),
          total: Math.max(0, (old?.total ?? 0) - 1),
        }))

        return { previous, key, isTemporary: isCommentTemporary }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous && !ctx.isTemporary) {
          queryClient.setQueryData(ctx.key, ctx.previous)
        }
      },
    }),

  likeMutation: () =>
    mutationOptions({
      mutationKey: [...commentQueries.all(), "like"] as const,
      mutationFn: async ({
        id,
        likes,
        isTemporary,
      }: {
        id: number
        postId: number
        likes: number
        isTemporary?: boolean
      }) => {
        if (id < 0 || isTemporary) {
          return {
            id,
            body: "temp",
            postId: 0,
            likes,
            user: { username: "temp-user" },
            isTemporary: true,
          } as CommentItem
        }

        return commentApi.likeComment(id, likes)
      },
      onMutate: async ({ id, postId, likes, isTemporary }) => {
        const key = commentQueries.byPost(postId)
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<{ comments: CommentItem[]; total: number }>(key)

        const currentComment = previous?.comments?.find((c) => c.id === id)
        const isCommentTemporary = isTemporary || currentComment?.isTemporary || id < 0

        queryClient.setQueryData(key, (old: { comments: CommentItem[]; total: number }) => ({
          comments: (old?.comments ?? []).map((c) => (c.id === id ? { ...c, likes } : c)),
          total: old?.total ?? 0,
        }))

        return { previous, key, isTemporary: isCommentTemporary }
      },
      onError: (_e, _vars, ctx) => {
        if (ctx?.previous && !ctx.isTemporary) {
          queryClient.setQueryData(ctx.key, ctx.previous)
        }
      },
    }),
}
