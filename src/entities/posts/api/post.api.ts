import { httpClient } from "@/shared/lib"

import type {
  addPostRequestSchema,
  deletePostRequestSchema,
  updatePostRequestSchema,
} from "../model"
import {
  getPostsBySlugRequestParamsSchema,
} from "../model"
import {
  addPostResponseSchema,
  deletePostResponseSchema,
  getPostsRequestParamsSchema,
  getPostsResponseSchema,
  getPostTagsResponseSchema,
  updatePostResponseSchema,
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

export const getPostsBySlug = async (requestParams: z.infer<typeof getPostsBySlugRequestParamsSchema>) => {
  const parsedRequestParams = getPostsBySlugRequestParamsSchema.parse(requestParams)
  const response = await httpClient.get<z.infer<typeof getPostsResponseSchema>>(`/api/posts/tag/${parsedRequestParams.slug}`, {
    params: getPostsRequestParamsSchema.parse(parsedRequestParams),
  })

  return getPostsResponseSchema.parse(response.data)
}

export const addPost = async (requestBody: z.infer<typeof addPostRequestSchema>) => {
  const response = await httpClient.post<z.infer<typeof addPostResponseSchema>>("/api/posts/add", requestBody)

  return addPostResponseSchema.parse(response.data)
}

export const updatePost = async (requestBody: z.infer<typeof updatePostRequestSchema>) => {
  const response = await httpClient.put<z.infer<typeof updatePostResponseSchema>>(`/api/posts/${requestBody.id}`, requestBody)

  return updatePostResponseSchema.parse(response.data)
}

export const deletePost = async (requestParams: z.infer<typeof deletePostRequestSchema>) => {
  const response = await httpClient.delete<z.infer<typeof deletePostResponseSchema>>(`/api/posts/${requestParams.id}`)

  return deletePostResponseSchema.parse(response.data)
}
