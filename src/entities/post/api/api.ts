import { http } from "../../../shared/lib/http-client"
import type { TagItem, Post } from "../model"

export type SortOrder = "asc" | "desc"

export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export interface FetchPostsParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: SortOrder
}

export type CreatePostDto = Pick<Post, "title" | "body" | "userId">

export interface FetchPostsByTagParams {
  tag: string
}

export interface FetchPostsBySearchParams extends FetchPostsParams {
  search?: string
}

export const postApi = {
  getPosts: async (params: FetchPostsParams): Promise<PostsResponse> => {
    return http.get<PostsResponse>("/posts", { params })
  },

  getPostsByTag: async (tag: string): Promise<PostsResponse> => {
    return http.get<PostsResponse>(`/posts/tag/${tag}`)
  },

  searchPosts: async (query: string): Promise<PostsResponse> => {
    return http.get<PostsResponse>("/posts/search", { params: { q: query } })
  },

  addPost: async (post: Omit<Post, "id">): Promise<Post> => {
    return http.post<Post>("/posts/add", post)
  },

  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    return http.put<Post>(`/posts/${id}`, post)
  },

  deletePost: async (id: number): Promise<void> => {
    return http.delete<void>(`/posts/${id}`)
  },

  getTags: async (): Promise<TagItem[]> => {
    return http.get<TagItem[]>("/posts/tags")
  },
}
