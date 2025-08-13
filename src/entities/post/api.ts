import { apiRequest } from "@/shared/api/base"

import type { Post, PostTag } from "./model"

export const postApi = {
  getPosts: (params: { limit: number; skip: number }) =>
    apiRequest<{ posts: Post[]; total: number }>(`/posts?limit=${params.limit}&skip=${params.skip}`),

  searchPosts: (query: string) => apiRequest<{ posts: Post[]; total: number }>(`/posts/search?q=${query}`),

  getPostsByTag: (tag: string) => apiRequest<{ posts: Post[]; total: number }>(`/posts/tag/${tag}`),

  getTags: () => apiRequest<PostTag[]>("/posts/tags"),

  createPost: (post: Omit<Post, "id">) =>
    apiRequest<Post>("/posts/add", {
      method: "POST",
      body: JSON.stringify(post),
    }),

  updatePost: (id: number, post: Partial<Post>) =>
    apiRequest<Post>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    }),

  deletePost: (id: number) =>
    apiRequest(`/posts/${id}`, {
      method: "DELETE",
    }),
}
