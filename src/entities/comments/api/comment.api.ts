import { httpClient } from "@/shared/lib"
import z from "zod"
import {
  addCommentRequestSchema,
  deleteCommentRequestSchema,
  getCommentsByPostIdRequestParamsSchema,
  getCommentsByPostIdResponseSchema,
  likeCommentRequestSchema,
  updateCommentRequestSchema,
} from "../model"

export const getCommentsByPostId = async (requestParams: z.infer<typeof getCommentsByPostIdRequestParamsSchema>) => {
  const parsedRequestParams = getCommentsByPostIdRequestParamsSchema.parse(requestParams)

  const response = await httpClient.get<z.infer<typeof getCommentsByPostIdResponseSchema>>(
    `api/comments/post/${parsedRequestParams.postId}`,
  )

  return getCommentsByPostIdResponseSchema.parse(response.data)
}

export const addComment = async (requestBody: z.infer<typeof addCommentRequestSchema>) => {
  const response = await httpClient.post(`/api/comments/add`, requestBody)

  return response.data
}

export const updateComment = async (requestBody: z.infer<typeof updateCommentRequestSchema>) => {
  const response = await httpClient.put(`/api/comments/${requestBody.id}`, requestBody.body)

  return response.data
}

export const deleteComment = async (requestBody: z.infer<typeof deleteCommentRequestSchema>) => {
  const response = await httpClient.delete(`/api/comments/${requestBody.id}`)

  return response.data
}

export const likeComment = async (requestBody: z.infer<typeof likeCommentRequestSchema>) => {
  const response = await httpClient.patch(`/api/comments/${requestBody.id}`, {
    likes: requestBody.likes,
  })

  return response.data
}
