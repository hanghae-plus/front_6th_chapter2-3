import type { addCommentResponseSchema, commentSchema, deleteCommentResponseSchema, getCommentsByPostIdResponseSchema, patchCommentResponseSchema, updateCommentResponseSchema } from "../model"

import type z from "zod"

export const addCommentResponseSchemaToCommentSchemaAdapter = (
  response: z.infer<typeof addCommentResponseSchema>,
): z.infer<typeof commentSchema> => {
  return {
    ...response,
    likes: 0,
    user: {
      id: response.user.id,
      username: response.user.username,
      fullName: response.user.fullName,
    },
  }
}

export const updateCommentResponseSchemaToCommentSchemaAdapter = (
  response: z.infer<typeof updateCommentResponseSchema>,
): z.infer<typeof commentSchema> => {
  return {
    ...response,
    likes: 0,
    user: {
      id: response.user.id,
      username: response.user.username,
      fullName: response.user.fullName,
    },
  }
}

export const patchCommentResponseSchemaToCommentSchemaAdapter = (
  response: z.infer<typeof patchCommentResponseSchema>,
): z.infer<typeof commentSchema> => {
  return {
    ...response,
    likes: response.likes ?? 0,
    user: {
      id: response.user.id,
      username: response.user.username,
      fullName: response.user.fullName,
    },
  }
}

export const optimisticAddComment = (
  prevComment: z.infer<typeof getCommentsByPostIdResponseSchema> | undefined,
  addCommentResponse: z.infer<typeof addCommentResponseSchema>,
): z.infer<typeof getCommentsByPostIdResponseSchema> => ({
  ...prevComment,
  limit: prevComment?.limit ?? 0,
  skip: prevComment?.skip ?? 0,
  total: prevComment?.total ?? 0,
  comments: [addCommentResponseSchemaToCommentSchemaAdapter(addCommentResponse), ...(prevComment?.comments ?? [])],
})

export const optimisticUpdateComment = (
  prevComment: z.infer<typeof getCommentsByPostIdResponseSchema> | undefined,
  updateCommentResponse: z.infer<typeof updateCommentResponseSchema>,
): z.infer<typeof getCommentsByPostIdResponseSchema> => ({
  ...prevComment,
  limit: prevComment?.limit ?? 0,
  skip: prevComment?.skip ?? 0,
  total: prevComment?.total ?? 0,
  comments: prevComment?.comments?.map((comment) => {
    if (comment.id === updateCommentResponse.id) {
      return updateCommentResponseSchemaToCommentSchemaAdapter(updateCommentResponse)
    }
    return comment
  }) ?? [],
})

export const optimisticDeleteComment = (
  prevPost: z.infer<typeof getCommentsByPostIdResponseSchema> | undefined,
  deletePostResponse: z.infer<typeof deleteCommentResponseSchema>,
): z.infer<typeof getCommentsByPostIdResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  comments: prevPost?.comments?.filter((comment) => comment.id !== deletePostResponse.id) ?? [],
})

export const optimisticPatchComment = (
  prevPost: z.infer<typeof getCommentsByPostIdResponseSchema> | undefined,
  patchCommentResponse: z.infer<typeof patchCommentResponseSchema>,
): z.infer<typeof getCommentsByPostIdResponseSchema> => ({
  ...prevPost,
  limit: prevPost?.limit ?? 0,
  skip: prevPost?.skip ?? 0,
  total: prevPost?.total ?? 0,
  comments: prevPost?.comments?.map((comment) => {
    if (comment.id === patchCommentResponse.id) {
      return patchCommentResponseSchemaToCommentSchemaAdapter(patchCommentResponse)
    }
    return comment
  }) ?? [],
})
