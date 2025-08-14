import type { UpdatePost, Post } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"

// 게시물 수정
export const updatePost = async (id: number, data: UpdatePost): Promise<Post> => {
  return HttpClient.patch<Post>(`/posts/${id}`, data)
}
