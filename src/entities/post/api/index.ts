import { HttpClient } from "@/shared/api/http"
import { Post, CreatePost, UpdatePost, PostFilter, PostPaginatedResponse } from "../model/schema"

export const postApi = {
  // 게시물 목록 조회 (페이지네이션)
  async getPosts(filters: PostFilter = {}): Promise<PostPaginatedResponse> {
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
  },

  // 게시물 검색
  async searchPosts(query: string): Promise<PostPaginatedResponse> {
    return HttpClient.get<PostPaginatedResponse>(`/posts/search?q=${encodeURIComponent(query)}`)
  },

  // 태그별 게시물 조회
  async getPostsByTag(tag: string): Promise<PostPaginatedResponse> {
    return HttpClient.get<PostPaginatedResponse>(`/posts/tag/${tag}`)
  },

  // 단일 게시물 조회
  async getPost(id: number): Promise<Post> {
    return HttpClient.get<Post>(`/posts/${id}`)
  },

  // 게시물 생성
  async createPost(data: CreatePost): Promise<Post> {
    return HttpClient.post<Post>("/posts/add", data)
  },

  // 게시물 수정
  async updatePost(id: number, data: UpdatePost): Promise<Post> {
    return HttpClient.put<Post>(`/posts/${id}`, data)
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    return HttpClient.delete<void>(`/posts/${id}`)
  },

  // 태그 목록 조회
  async getTags(): Promise<Array<{ slug: string; url: string }>> {
    return HttpClient.get<Array<{ slug: string; url: string }>>("/posts/tags")
  },
}
