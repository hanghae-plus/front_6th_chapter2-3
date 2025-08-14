import { http } from "@shared/lib"
import type { Tag, Post } from "../model"
import type { PaginationParams } from "@shared/types/pagination"

export type CreatePostRequest = Pick<Post, "title" | "body" | "userId">
export type UpdatePostRequest = Partial<Post>

export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export type FetchPostsParams = PaginationParams

export interface FetchPostsByTagParams extends FetchPostsParams {
  tag: string
}

export interface FetchPostsBySearchParams extends FetchPostsParams {
  search?: string
}

export const postApi = {
  getPosts: async (params: FetchPostsParams): Promise<PostsResponse> => {
    return http.get<PostsResponse>("/posts", { params })
  },

  getPostsByTag: async (params: FetchPostsByTagParams): Promise<PostsResponse> => {
    const { tag, ...rest } = params
    return http.get<PostsResponse>(`/posts/tag/${tag}`, { params: rest })
  },

  searchPosts: async (params: FetchPostsBySearchParams): Promise<PostsResponse> => {
    const { search, ...rest } = params
    return http.get<PostsResponse>("/posts/search", { params: { q: search, ...rest } })
  },

  addPost: async (post: CreatePostRequest): Promise<Post> => {
    return http.post<Post>("/posts/add", post)
  },

  updatePost: async (id: number, post: UpdatePostRequest): Promise<Post> => {
    return http.put<Post>(`/posts/${id}`, post)
  },

  deletePost: async (id: number): Promise<void> => {
    return http.delete<void>(`/posts/${id}`)
  },

  getTags: async (): Promise<Tag[]> => {
    return http.get<Tag[]>("/posts/tags")
  },
}
