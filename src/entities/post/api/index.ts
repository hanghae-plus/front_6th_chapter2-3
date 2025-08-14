import { HttpClient } from "@/shared/api/http"
import { CreatePost, Post, PostFilter, PostPaginatedResponse, UpdatePost } from "../model/types"

// 전체 게시글 조회
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
  console.log("[DEBUG] url", url)
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 검색어 조회
export const getPostBySearch = (searchQuery: string) => {
  const url = `/posts/search?q=${searchQuery}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 태그별 조회
export const getPostByTag = (tag: string) => {
  const url = `/posts/tag/${tag}`
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
