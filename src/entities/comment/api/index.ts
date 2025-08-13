import { HttpClient } from "@/shared/api/http"
import type { Comment, CommentFilter, CommentPaginatedResponse } from "@/shared/types"

export const getCommentsByPost = (postId: number, filters: CommentFilter = {}) => {
  const params = new URLSearchParams()

  if (filters.limit) params.set("limit", filters.limit.toString())
  if (filters.skip) params.set("skip", filters.skip.toString())
  if (filters.orderBy) params.set("orderBy", filters.orderBy)

  const url = `/comments/post/${postId}${params.toString() ? `?${params.toString()}` : ""}`
  return HttpClient.get<CommentPaginatedResponse>(url)
}

export const getComment = (id: number) => HttpClient.get<Comment>(`/comments/${id}`)

export const createComment = (comment: { body: string; postId: number; userId: number }) =>
  HttpClient.post<Comment>("/comments", comment)

export const updateComment = (id: number, updates: { body?: string }) =>
  HttpClient.put<Comment>(`/comments/${id}`, updates)

export const deleteComment = (id: number) => HttpClient.delete(`/comments/${id}`)

export const likeComment = (id: number, likes: number) => HttpClient.patch<Comment>(`/comments/${id}`, { likes })
