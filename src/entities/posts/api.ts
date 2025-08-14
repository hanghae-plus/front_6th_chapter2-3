import { requestApi } from "../../shared/lib"
import { Posts } from "./type"

export const getPosts = async (limit: number, skip: number, sortBy: string, order: string) => {
  return await requestApi<Posts>(`/api/posts?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`)
}

export const getSeachPosts = async (searchQuery: string) => {
  return await requestApi<Posts>(`/api/posts/search?q=${searchQuery}`)
}

export const getPostsByTag = async (tag: string) => {
  return await requestApi<Posts>(`/api/posts/tag/${tag}`)
}
