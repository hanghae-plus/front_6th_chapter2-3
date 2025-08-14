import type { CreatePost, Post } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"

// 게시물 생성
export const createPost = async (data: CreatePost): Promise<Post> => {
  return HttpClient.post<Post>("/posts/add", data)
}
