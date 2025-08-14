import { HttpClient } from "@/shared/api/http"
import type { Comment, CommentPaginatedResponse } from "@/shared/types"

export const getCommentsByPost = (postId: number) => {
  const url = `/comments/post/${postId}`
  return HttpClient.get<CommentPaginatedResponse>(url)
}

export const getComment = (id: number) => HttpClient.get<Comment>(`/comments/${id}`)
