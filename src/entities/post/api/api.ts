import { http } from "../../../shared/lib/http-client"
import type { Post, PostBase, PostsResponse, TagItem } from "../../../shared/types"

export const postApi = {
  getPosts: async (limit: number, skip: number): Promise<PostsResponse> => {
    return http.get<PostsResponse>("/posts", { params: { limit, skip } })
  },

  getPostsByTag: async (tag: string): Promise<PostsResponse> => {
    return http.get<PostsResponse>(`/posts/tag/${tag}`)
  },

  searchPosts: async (query: string): Promise<PostsResponse> => {
    return http.get<PostsResponse>("/posts/search", { params: { q: query } })
  },

  addPost: async (post: Omit<PostBase, "id">): Promise<Post> => {
    return http.post<Post>("/posts/add", post)
  },

  updatePost: async (id: number, post: Partial<PostBase>): Promise<Post> => {
    return http.put<Post>(`/posts/${id}`, post)
  },

  deletePost: async (id: number): Promise<void> => {
    return http.delete<void>(`/posts/${id}`)
  },

  getTags: async (): Promise<TagItem[]> => {
    return http.get<TagItem[]>("/posts/tags")
  },
}
