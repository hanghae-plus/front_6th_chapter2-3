import { HttpClient } from "@/shared/api/http"
import type { Comment } from "@/shared/types"

export const createComment = (comment: { body: string; postId: number; userId: number }) =>
  HttpClient.post<Comment>("/comments", comment)

export const updateComment = (id: number, updates: { body?: string }) =>
  HttpClient.put<Comment>(`/comments/${id}`, updates)

export const deleteComment = (id: number) => HttpClient.delete(`/comments/${id}`)

export const likeComment = (id: number, likes: number) => HttpClient.patch<Comment>(`/comments/${id}`, { likes })
