import { apiClient } from "../../../shared/api/base"
import { CreatePostRequest, Post, PostsResponse, UpdatePost } from "../model/types"

export const postApi = {
  /** 게시물 목록 가져오기 */
  async getPosts(limit: number, skip: number): Promise<PostsResponse> {
    return await apiClient.get<PostsResponse>(`/posts?limit=${limit}&skip=${skip}`)
  },

  /** 게시물 검색 */
  async searchPosts(searchQuery: string): Promise<PostsResponse> {
    return await apiClient.get<PostsResponse>(`/posts/search?q=${encodeURIComponent(searchQuery)}`)
  },

  /** 태그별 게시물 가져오기 */
  async getPostsByTag(tag: string): Promise<PostsResponse> {
    return await apiClient.get<PostsResponse>(`/posts/tag/${tag}`)
  },

  /** 게시물 추가 */
  async addPost(newPost: CreatePostRequest): Promise<Post> {
    return await apiClient.post<Post>("/posts/add", newPost)
  },

  /** 게시물 업데이트 */
  async updatePost(id: number, updatedPost: UpdatePost): Promise<Post> {
    return await apiClient.put<Post>(`/posts/${id}`, updatedPost)
  },

  /** 게시물 삭제 */
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`)
  },
}
