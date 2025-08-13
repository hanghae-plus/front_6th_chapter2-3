import type { Comment, CreateComment, UpdateComment, CommentReaction } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"

/**
 * 새 댓글을 생성합니다
 * @param data - 댓글 생성 데이터
 */
export const createComment = async (data: CreateComment): Promise<Comment> => {
  return HttpClient.post<Comment>("/api/comments/add", data)
}

/**
 * 댓글을 수정합니다
 * @param id - 댓글 ID
 * @param data - 수정할 데이터
 */
export const updateComment = async (id: number, data: UpdateComment): Promise<Comment> => {
  return HttpClient.put<Comment>(`/api/comments/${id}`, data)
}

/**
 * 댓글을 삭제합니다
 * @param id - 댓글 ID
 */
export const deleteComment = async (id: number): Promise<void> => {
  return HttpClient.delete(`/api/comments/${id}`)
}

/**
 * 댓글의 반응(좋아요/싫어요)을 업데이트합니다
 * @param id - 댓글 ID
 * @param data - 반응 데이터
 */
export const updateCommentReaction = async (id: number, data: CommentReaction): Promise<Comment> => {
  return HttpClient.patch<Comment>(`/api/comments/${id}`, data)
}

/**
 * 댓글에 좋아요를 추가합니다
 * @param id - 댓글 ID
 */
export const likeComment = async (id: number): Promise<Comment> => {
  return HttpClient.patch<Comment>(`/api/comments/${id}`, { likes: 1 })
}

/**
 * 댓글에 싫어요를 추가합니다
 * @param id - 댓글 ID
 */
export const dislikeComment = async (id: number): Promise<Comment> => {
  return HttpClient.patch<Comment>(`/api/comments/${id}`, { dislikes: 1 })
}
