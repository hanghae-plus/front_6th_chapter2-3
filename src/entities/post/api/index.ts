import { HttpClient } from "@/shared/api/http"
import type { Post, PostFilter, PostPaginatedResponse, Tag } from "@/shared/types"

export const getPosts = (filters: PostFilter = {}) => {
  const params = new URLSearchParams()

  // 페이지네이션 파라미터 (필수)
  if (filters.limit) params.set("limit", filters.limit.toString())
  if (filters.skip) params.set("skip", filters.skip.toString())

  // 검색 파라미터
  if (filters.search) params.set("q", filters.search)

  // 태그 파라미터
  if (filters.tag && filters.tag !== "all") params.set("tag", filters.tag)

  // 정렬 파라미터
  if (filters.sortBy && filters.sortBy !== "none") {
    params.set("sortBy", filters.sortBy)
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder)
  }

  const url = `/posts${params.toString() ? `?${params.toString()}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

export const getPostBySearch = (searchQuery: string) => {
  const url = `/posts/search?q=${searchQuery}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

export const getPostByTag = (tag: string) => {
  const url = `/posts/tag/${tag}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

export const getPost = (id: number) => HttpClient.get<Post>(`/posts/${id}`)

export const getTags = () => HttpClient.get<Tag[]>(`/posts/tags`)
