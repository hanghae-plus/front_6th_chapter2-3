import { getUserById } from "@/entities/user/api"
import { HttpClient } from "@/shared/api/http"
import { buildApiQueryParams, BaseQueryParams } from "@/shared/lib"
import { CreatePost, Post, PostPaginatedResponse, PostWithAuthor, UpdatePost } from "../model"

// 전체 게시글 조회
export const getPosts = (filters: BaseQueryParams = {}): Promise<PostPaginatedResponse> => {
  const queryString = buildApiQueryParams(filters)
  const url = `/posts${queryString ? `?${queryString}` : ""}`
  console.log("[DEBUG] url", url)
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 검색어 조회
export const getPostBySearch = (
  searchQuery: string,
  baseQueryParams: BaseQueryParams = {},
): Promise<PostPaginatedResponse> => {
  const queryString = buildApiQueryParams(baseQueryParams)
  const url = `/posts/search?q=${searchQuery}${queryString ? `&${queryString}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 태그별 조회
export const getPostByTag = (tag: string, filters: BaseQueryParams = {}): Promise<PostPaginatedResponse> => {
  const queryString = buildApiQueryParams(filters)
  const url = `/posts/tag/${tag}${queryString ? `?${queryString}` : ""}`
  return HttpClient.get<PostPaginatedResponse>(url)
}

// 게시물 상세 조회
export const getPost = (id: number): Promise<Post> => HttpClient.get<Post>(`/posts/${id}`)

// 게시물 생성
export const createPost = async (data: CreatePost): Promise<Post> => {
  return HttpClient.post<Post>("/posts/add", data)
}

// 게시물 삭제
export const deletePost = async (id: number): Promise<Post> => {
  return HttpClient.delete<Post>(`/posts/${id}`)
}

// 게시물 수정
export const updatePost = async (id: number, data: UpdatePost): Promise<Post> => {
  return HttpClient.patch<Post>(`/posts/${id}`, data)
}

// 게시물 생성 시 작성자 정보 추가
export const createPostWithAuth = async (data: CreatePost): Promise<PostWithAuthor> => {
  const post = await createPost(data)
  const author = await getUserById(post.userId)
  return { ...post, author }
}
