import { api } from "../../shared/api/api"
import { ListResponse } from "../../shared/types/types"
import { Comment, CommentRequest } from "./model"

/**
 * 댓글 목록 조회
 * @param postId - 게시물 ID
 * @returns 댓글 목록
 */
export const fetchComments = async (postId: number) => {
  const response = await api.get<ListResponse<"comments", Comment>>(`/comments/post/${postId}`)
  return response
}

/**
 * 댓글 추가
 * @param comment - 댓글 정보
 * @returns 댓글 정보
 */
export const addComment = async (comment: CommentRequest) => {
  const response = await api.post(`/comments`, comment)
  return response
}

/**
 * 댓글 수정
 * @param comment - 댓글 정보
 * @returns 댓글 정보
 */
export const updateComment = async (comment: Comment) => {
  const response = await api.put(`/comments/${comment.id}`, { body: comment.body })
  return response
}

/**
 * 댓글 삭제
 * @param commentId - 댓글 ID
 * @returns 댓글 정보
 */
export const deleteComment = async (commentId: number) => {
  const response = await api.delete(`/comments/${commentId}`)
  return response
}

/**
 * 댓글 좋아요
 * @param commentId - 댓글 ID
 * @returns 댓글 정보
 */
export const likeComment = async (commentId: number) => {
  const response = await api.patch(`/comments/${commentId}`, { likes: 1 })
  return response
}
