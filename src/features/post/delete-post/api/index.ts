import type { Post } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"

// 게시물 삭제
export const deletePost = async (id: number): Promise<Post> => {
  return HttpClient.delete<Post>(`/posts/${id}`)
}
