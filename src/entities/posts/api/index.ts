import { axiosInstance } from "../../../shared/utils/axios"
import { getPostsParams, getPostsSearchParams, getPostsTagParams, PostsData, PostsTags } from "./types"

export const getPosts = async (params: getPostsParams) => {
  const searchParams = new URLSearchParams({
    limit: params.limit?.toString() ?? "0",
    skip: params.skip ?? "0",
  })

  return axiosInstance.get<PostsData>(`/posts?${searchParams}`)
}

export const getPostsTags = async () => {
  return axiosInstance.get<Array<PostsTags>>(`/posts/tags`)
}

export const getPostsTagTagName = async (tagName: string, params: getPostsTagParams) => {
  const searchParams = new URLSearchParams({
    limit: params.limit?.toString() ?? "0",
    skip: params.skip ?? "0",
  })

  return axiosInstance.get<PostsData>(`/posts/tag/${tagName}?${searchParams}`)
}

export const getPostsSearch = async (q: string, params?: getPostsSearchParams) => {
  const searchParams = new URLSearchParams({
    q: q ?? "",
    limit: params?.limit?.toString() ?? "0",
    skip: params?.skip ?? "0",
  })

  return axiosInstance.get<PostsData>(`/posts/search?${searchParams}`)
}
