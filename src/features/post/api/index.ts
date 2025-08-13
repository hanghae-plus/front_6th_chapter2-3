import type { CreatePost, UpdatePost, Post, DeletePostResponse } from "@/entities/post/model/types"
import { HttpClient } from "@/shared/api/http"

// 게시물 생성
export const createPost = async (data: CreatePost): Promise<Post> => {
  return HttpClient.post<Post>("/posts/add", data)
}

// 게시물 수정
export const updatePost = async (id: number, data: UpdatePost): Promise<Post> => {
  return HttpClient.put<Post>(`/posts/${id}`, data)
}

// 게시물 삭제
export const deletePost = async (id: number): Promise<DeletePostResponse> => {
  console.log("여기 호출")
  const res = await HttpClient.delete<DeletePostResponse>(`/posts/${id}`)
  console.log(res)
  return res.data.data
}
