import { HttpClient } from "@/shared/api/http"
import type { Post, PostFilter, PostPaginatedResponse } from "../model/type"

// 게시물 목록 조회 (페이지네이션)
export const getPosts = async (filters: PostFilter = {}): Promise<PostPaginatedResponse> => {
  const params = new URLSearchParams()

  if (filters.limit) params.set("limit", filters.limit.toString())
  if (filters.skip) params.set("skip", filters.skip.toString())
  if (filters.search) params.set("q", filters.search)
  if (filters.tag && filters.tag !== "all") params.set("tag", filters.tag)
  if (filters.sortBy && filters.sortBy !== "none") {
    params.set("sortBy", filters.sortBy)
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder)
  }

  const url = `/posts${params.toString() ? `?${params.toString()}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 검색
export const searchPosts = async (query: string): Promise<PostPaginatedResponse> => {
  return HttpClient.get<PostPaginatedResponse>(`/posts/search?q=${encodeURIComponent(query)}`)
}

// 태그별 게시물 조회
export const getPostsByTag = async (tag: string): Promise<PostPaginatedResponse> => {
  return HttpClient.get<PostPaginatedResponse>(`/posts/tag/${tag}`)
}

// 단일 게시물 조회
export const getPost = async (id: number): Promise<Post> => {
  return HttpClient.get<Post>(`/posts/${id}`)
}
