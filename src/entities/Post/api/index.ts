import type { Post, PostInput } from "../index.ts"
import ky from "ky"

export type SortBy = keyof Post
export type SortOrder = "asc" | "desc"

export interface PaginationParams {
  limit?: number
  skip?: number
  sortBy?: SortBy
  sortOrder?: SortOrder
}

interface PostsResponse {
  posts: Post[]
  total: number
}

const makeSearchParams = (params?: PaginationParams) => {
  if (!params) return {}
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined))
}

//
export async function fetchPosts(params?: PaginationParams): Promise<PostsResponse> {
  return ky.get(`/api/posts`, { searchParams: makeSearchParams(params) }).json()
}

export async function fetchPostsByTag(tag: string, params?: PaginationParams): Promise<PostsResponse> {
  return ky.get(`/api/posts/tag/${tag}`, { searchParams: makeSearchParams(params) }).json()
}

export async function fetchPostsSearch(query: string, params?: PaginationParams): Promise<PostsResponse> {
  return ky.get(`/api/posts/search`, { searchParams: { q: query, ...makeSearchParams(params) } }).json()
}

export async function addPost(post: PostInput): Promise<Post> {
  return ky.post("/api/posts/add", { json: post }).json()
}

export async function putPost(id: number, post: PostInput): Promise<Post> {
  return ky.put(`/api/posts/${id}`, { json: post }).json()
}

export function deletePost(id: number): Promise<void> {
  return ky.delete(`/api/posts/${id}`).json()
}
