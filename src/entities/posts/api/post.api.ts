import { httpClient } from "@/shared/lib"

import type { addPostRequestSchema, deletePostRequestSchema, updatePostRequestSchema } from "../model"
import {
  addPostResponseSchema,
  getPostsRequestParamsSchema,
  getPostsResponseSchema,
  getPostTagsResponseSchema,
} from "../model"

import type z from "zod"

export const getPosts = async (requestParams: z.infer<typeof getPostsRequestParamsSchema>) => {
  const parsedRequestParams = getPostsRequestParamsSchema.parse(requestParams)

  const response = await httpClient.get<z.infer<typeof getPostsResponseSchema>>("/api/posts", {
    params: parsedRequestParams,
  })

  return getPostsResponseSchema.parse(response.data)
}

export const getPostTags = async () => {
  const response = await httpClient.get<z.infer<typeof getPostTagsResponseSchema>>("/api/posts/tags")

  return getPostTagsResponseSchema.parse(response.data)
}

export const getPostsBySlug = async (slug: string) => {
  const response = await httpClient.get<z.infer<typeof getPostsResponseSchema>>(`/api/posts/tags/${slug}`)

  return getPostsResponseSchema.parse(response.data)
}

export const addPost = async (requestBody: z.infer<typeof addPostRequestSchema>) => {
  const response = await httpClient.post<z.infer<typeof addPostResponseSchema>>("/api/posts/add", requestBody)

  return addPostResponseSchema.parse(response.data)
}

export const updatePost = async (requestBody: z.infer<typeof updatePostRequestSchema>) => {
  const response = await httpClient.put(`/api/posts/${requestBody.id}`, requestBody)

  return response.data
}

export const deletePost = async (requestParams: z.infer<typeof deletePostRequestSchema>) => {
  const response = await httpClient.delete(`/api/posts/${requestParams.id}`)

  return response.data
}
