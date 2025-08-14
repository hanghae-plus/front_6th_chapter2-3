import { HttpClient } from "@/shared/api/http"
import type { Comment, CommentPaginatedResponse, CreateComment } from "@/shared/types"

// 댓글 목록 조회
export const getCommentsByPost = (postId: number) => {
  const url = `/comments/post/${postId}`
  return HttpClient.get<CommentPaginatedResponse>(url)
}

// 댓글 상세보기
export const getComment = (id: number) => HttpClient.get<Comment>(`/comments/${id}`)

// 댓글 생성
export const createComment = (comment: CreateComment) => HttpClient.post<Comment>("/comments/add", comment)

// 댓글 수정
export const updateComment = (id: number, updates: { body?: string }) =>
  HttpClient.put<Comment>(`/comments/${id}`, updates)

// 댓글 삭제
export const deleteComment = (id: number) => HttpClient.delete(`/comments/${id}`)

// 좋아요
export const likeComment = (id: number, likes: number) => HttpClient.patch<Comment>(`/comments/${id}`, { likes })
