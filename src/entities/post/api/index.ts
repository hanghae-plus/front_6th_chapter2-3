import type { Post, PostQueryParams, PostsResponse, SearchQueryParams } from "@/entities/post/model/types"

import { apiClient } from "@/shared/api/apiClient"

export const postApi = {
  async create(post: Pick<Post, "body" | "title" | "userId">) {
    return apiClient.post<Post>("/posts/add", post)
  },
  async delete(postId: number) {
    return apiClient.delete<Post>(`/posts/${postId}`)
  },
  async getAll(params: Partial<PostQueryParams>) {
    return apiClient.get<PostsResponse>("/posts", { params })
  },
  async getAllByTag(tag: string) {
    return apiClient.get<PostsResponse>(`/posts/tag/${tag}`)
  },
  async search(params: SearchQueryParams) {
    return apiClient.get<PostsResponse>("/posts/search", { params })
  },
  async update(post: Post) {
    return apiClient.put<Post>(`/posts/${post.id}`, post)
  },
}
