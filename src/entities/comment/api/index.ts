import { httpClient } from "@/shared/api/http"
import { Comment, CommentPaginatedResponse, CreateComment } from "../model"

// 댓글 목록 조회
export const getCommentsByPost = (postId: number): Promise<CommentPaginatedResponse> => {
  const url = `/comments/post/${postId}`
  return httpClient.get<CommentPaginatedResponse>(url)
}

// 댓글 상세보기
export const getComment = (id: number): Promise<Comment> => httpClient.get<Comment>(`/comments/${id}`)

// 댓글 생성
export const createComment = (comment: CreateComment): Promise<Comment> =>
  httpClient.post<Comment>("/comments/add", comment)

// 댓글 수정
export const updateComment = (id: number, updates: { body?: string }): Promise<Comment> =>
  httpClient.put<Comment>(`/comments/${id}`, updates)

// 댓글 삭제
export const deleteComment = (id: number): Promise<Comment> => httpClient.delete(`/comments/${id}`)

// 좋아요
export const likeComment = (id: number, likes: number): Promise<Comment> =>
  httpClient.patch<Comment>(`/comments/${id}`, { likes })
