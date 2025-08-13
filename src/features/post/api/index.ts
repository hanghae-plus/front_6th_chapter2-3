import type { CreatePost, UpdatePost, Post } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"

// 게시물 생성
export const createPost = async (data: CreatePost): Promise<Post> => {
  return HttpClient.post<Post>("/posts/add", data)
}

// 게시물 수정
export const updatePost = async (id: number, data: UpdatePost): Promise<Post> => {
  return HttpClient.patch<Post>(`/posts/${id}`, data)
}

// 게시물 삭제
export const deletePost = async (id: number): Promise<Post> => {
  return HttpClient.delete<Post>(`/posts/${id}`)
}
