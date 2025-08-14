import { HttpClient } from "@/shared/api/http"
import { buildApiQueryParams } from "@/shared/lib/queryParams"
import { CreatePost, Post, PostOptions, PostPaginatedResponse, UpdatePost } from "../model/types"

// 전체 게시글 조회
export const getPosts = (filters: PostOptions = {}) => {
  const queryString = buildApiQueryParams(filters)
  const url = `/posts${queryString ? `?${queryString}` : ""}`
  console.log("[DEBUG] url", url)
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 검색어 조회
export const getPostBySearch = (searchQuery: string, filters: PostOptions = {}) => {
  const queryString = buildApiQueryParams(filters)
  const url = `/posts/search?q=${searchQuery}${queryString ? `&${queryString}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 태그별 조회
export const getPostByTag = (tag: string, filters: PostOptions = {}) => {
  const queryString = buildApiQueryParams(filters)
  const url = `/posts/tag/${tag}${queryString ? `?${queryString}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 상세 조회
export const getPost = (id: number) => HttpClient.get<Post>(`/posts/${id}`)

// 게시물 생성
export const createPost = async (data: CreatePost): Promise<Post> => {
  return HttpClient.post<Post>("/posts/add", data)
}

// 게시물 삭제
export const deletePost = async (id: number): Promise<Post> => {
  return HttpClient.delete<Post>(`/posts/${id}`)
}

export const updatePost = async (id: number, data: UpdatePost): Promise<Post> => {
  return HttpClient.patch<Post>(`/posts/${id}`, data)
}
