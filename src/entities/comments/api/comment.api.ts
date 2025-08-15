import { httpClient } from "@/shared/lib"

import type {
  addCommentRequestSchema,
  deleteCommentRequestSchema,
  updateCommentRequestSchema,
} from "../model"
import {
  addCommentResponseSchema,
  deleteCommentResponseSchema,
  dislikeCommentRequestSchema,
  getCommentsByPostIdRequestParamsSchema,
  getCommentsByPostIdResponseSchema,
  likeCommentRequestSchema,
  patchCommentResponseSchema,
  updateCommentResponseSchema,
} from "../model"

import type z from "zod"

export const getCommentsByPostId = async (requestParams: z.infer<typeof getCommentsByPostIdRequestParamsSchema>) => {
  const parsedRequestParams = getCommentsByPostIdRequestParamsSchema.parse(requestParams)

  const response = await httpClient.get<z.infer<typeof getCommentsByPostIdResponseSchema>>(
    `/api/comments/post/${parsedRequestParams.postId}`,
  )

  return getCommentsByPostIdResponseSchema.parse(response.data)
}

export const addComment = async (requestBody: z.infer<typeof addCommentRequestSchema>) => {
  const response = await httpClient.post<z.infer<typeof addCommentResponseSchema>>("/api/comments/add", requestBody)

  return addCommentResponseSchema.parse(response.data)
}

export const updateComment = async (requestBody: z.infer<typeof updateCommentRequestSchema>) => {
  const response = await httpClient.put<z.infer<typeof updateCommentResponseSchema>>(`/api/comments/${requestBody.id}`, {
    body: requestBody.body,
  })

  return updateCommentResponseSchema.parse(response.data)
}

export const deleteComment = async (requestBody: z.infer<typeof deleteCommentRequestSchema>) => {
  const response = await httpClient.delete<z.infer<typeof deleteCommentResponseSchema>>(`/api/comments/${requestBody.id}`)

  return deleteCommentResponseSchema.parse(response.data)
}

export const likeComment = async (requestBody: z.infer<typeof likeCommentRequestSchema>) => {
  const parsedRequestBody = likeCommentRequestSchema.parse(requestBody)

  console.log(parsedRequestBody)

  const response = await httpClient.patch<z.infer<typeof patchCommentResponseSchema>>(`/api/comments/${parsedRequestBody.id}`, {
    likes: parsedRequestBody.likes,
  })

  return patchCommentResponseSchema.parse(response.data)
}

export const dislikeComment = async (requestBody: z.infer<typeof dislikeCommentRequestSchema>) => {
  const parsedRequestBody = dislikeCommentRequestSchema.parse(requestBody)

  const response = await httpClient.patch<z.infer<typeof patchCommentResponseSchema>>(`/api/comments/${parsedRequestBody.id}`, {
    likes: parsedRequestBody.likes,
  })

  return patchCommentResponseSchema.parse(response.data)
}
