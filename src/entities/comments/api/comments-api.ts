import { Comment, CreateCommentData, UpdateCommentData } from "../model/types"
const BASE_URL = '/api/comments'

export const commentsApi = {
  // 게시물별 댓글 가져오기
  getCommentsByPost: async (postId: number): Promise<{ comments: Comment[] }> => {
    const response = await fetch(`${BASE_URL}/post/${postId}`)
    if (!response.ok) throw new Error('댓글 가져오기 오류: ' + response.statusText)
    return response.json()
  },

  // 댓글 추가
  create: async (commentData: CreateCommentData): Promise<Comment> => {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    })
    if (!response.ok) throw new Error('댓글 추가 오류: ' + response.statusText)
    return response.json()
  },

  // 댓글 수정
  update: async (id: number, updateData: UpdateCommentData): Promise<Comment> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
    if (!response.ok) throw new Error('댓글 수정 오류: ' + response.statusText)
    return response.json()
  },

  // 댓글 삭제
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('댓글 삭제 오류: ' + response.statusText)
  },

  // 댓글 좋아요/싫어요
  like: async (id: number, likes: number): Promise<Comment> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes }),
    })
    if (!response.ok) throw new Error('댓글 좋아요 오류: ' + response.statusText)
    return response.json()
  },
}