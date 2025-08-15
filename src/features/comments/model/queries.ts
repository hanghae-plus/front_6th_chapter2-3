import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCommentsPost,
  createComments,
  updateComments,
  deleteComments,
  updateCommentsLikes,
  CreateCommentsRequest,
} from "../../../entities/comments"
import type { Comments } from "../../../entities/comments/api/types"

// Query Keys
export const commentsKeys = {
  all: ["comments"] as const,
  lists: () => [...commentsKeys.all, "list"] as const,
  list: (postId: number) => [...commentsKeys.lists(), postId] as const,
}

// Comments Query
export const useCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentsKeys.list(postId),
    queryFn: async () => {
      const response = await getCommentsPost(postId)
      return response.data.comments
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// Add Comment Mutation
export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newComment: CreateCommentsRequest) => createComments(newComment),
    onMutate: async (newComment) => {
      if (!newComment.postId) return

      await queryClient.cancelQueries({ queryKey: commentsKeys.list(newComment.postId) })
      const previousComments = queryClient.getQueryData(commentsKeys.list(newComment.postId))

      // Optimistic update
      queryClient.setQueryData(commentsKeys.list(newComment.postId), (old: Comments[] | undefined) => {
        if (!old) return old

        const optimisticComment: Comments = {
          id: Date.now(), // temporary ID
          body: newComment.body,
          postId: newComment.postId!,
          likes: 0,
          user: {
            id: newComment.userId,
            username: "You", // placeholder
            fullName: "You",
          },
        }

        return [...old, optimisticComment]
      })

      return { previousComments }
    },
  })
}

// Update Comment Mutation
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => updateComments(id, body),
    onMutate: async ({ id, body }) => {
      // Find which post this comment belongs to
      const allCommentQueries = queryClient.getQueriesData({ queryKey: commentsKeys.lists() })

      let commentPostId: number | null = null
      for (const [, data] of allCommentQueries) {
        if (Array.isArray(data)) {
          const comment = data.find((c: Comments) => c.id === id)
          if (comment) {
            commentPostId = comment.postId
            break
          }
        }
      }

      if (!commentPostId) return

      await queryClient.cancelQueries({ queryKey: commentsKeys.list(commentPostId) })
      const previousComments = queryClient.getQueryData(commentsKeys.list(commentPostId))

      // Optimistic update
      queryClient.setQueryData(commentsKeys.list(commentPostId), (old: Comments[] | undefined) => {
        if (!old) return old

        return old.map((comment) => (comment.id === id ? { ...comment, body } : comment))
      })

      return { previousComments, commentPostId }
    },
  })
}

// Delete Comment Mutation
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => deleteComments(commentId),
    onMutate: async (commentId) => {
      // Find which post this comment belongs to
      const allCommentQueries = queryClient.getQueriesData({ queryKey: commentsKeys.lists() })

      let commentPostId: number | null = null
      for (const [, data] of allCommentQueries) {
        if (Array.isArray(data)) {
          const comment = data.find((c: Comments) => c.id === commentId)
          if (comment) {
            commentPostId = comment.postId
            break
          }
        }
      }

      if (!commentPostId) return

      await queryClient.cancelQueries({ queryKey: commentsKeys.list(commentPostId) })
      const previousComments = queryClient.getQueryData(commentsKeys.list(commentPostId))

      // Optimistic update
      queryClient.setQueryData(commentsKeys.list(commentPostId), (old: Comments[] | undefined) => {
        if (!old) return old

        return old.filter((comment) => comment.id !== commentId)
      })

      return { previousComments, commentPostId }
    },
  })
}

// Like Comment Mutation
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, likes }: { commentId: number; likes: number }) =>
      updateCommentsLikes(commentId, { likes }),
    onMutate: async ({ commentId, likes }) => {
      // Find which post this comment belongs to
      const allCommentQueries = queryClient.getQueriesData({ queryKey: commentsKeys.lists() })

      let commentPostId: number | null = null
      for (const [, data] of allCommentQueries) {
        if (Array.isArray(data)) {
          const comment = data.find((c: Comments) => c.id === commentId)
          if (comment) {
            commentPostId = comment.postId
            break
          }
        }
      }

      if (!commentPostId) return

      await queryClient.cancelQueries({ queryKey: commentsKeys.list(commentPostId) })
      const previousComments = queryClient.getQueryData(commentsKeys.list(commentPostId))

      // Optimistic update
      queryClient.setQueryData(commentsKeys.list(commentPostId), (old: Comments[] | undefined) => {
        if (!old) return old

        return old.map((comment) => (comment.id === commentId ? { ...comment, likes } : comment))
      })

      return { previousComments, commentPostId }
    },
  })
}
