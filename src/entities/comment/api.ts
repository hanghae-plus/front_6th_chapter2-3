import { IComment } from './model'
import { http } from '@shared/lib/http-client'

/**
 * 댓글 목록 조회
 * @param postId - 게시물 ID
 * @returns 댓글 목록
 */
export const fetchComments = async (postId: number) => {
  const response = await http.get<{ comments: IComment[] }>(`/comments/post/${postId}`)
  return response
}

export interface ICommentRequest {
  postId: number
  body: string
  userId: number
}
/**
 * 댓글 추가
 * @param comment - 댓글 정보
 * @returns 댓글 정보
 */
export const addComment = async (comment: ICommentRequest) => {
  const response = await http.post('/comments/add', comment)
  return response
}

/**
 * 댓글 수정
 * @param comment - 댓글 정보
 * @returns 댓글 정보
 */
export const updateComment = async (comment: IComment) => {
  const response = await http.put(`/comments/${comment.id}`, { body: comment.body })
  return response
}

/**
 * 댓글 삭제
 * @param commentId - 댓글 ID
 * @returns 댓글 정보
 */
export const deleteComment = async (commentId: number) => {
  const response = await http.delete(`/comments/${commentId}`)
  return response
}

/**
 * 댓글 좋아요
 * @param commentId - 댓글 ID
 * @returns 댓글 정보
 */
export const likeComment = async (commentId: number, likes: number) => {
  const response = await http.patch(`/comments/${commentId}`, { likes: likes + 1 })
  return response
}
