import { Comment, NewComment } from "../../../types"

const API_BASE_URL = "/api/comments"

export const commentApi = {
  // 특정 게시물의 댓글 가져오기
  async getCommentsByPost(postId: number): Promise<{ comments: Comment[] }> {
    const response = await fetch(`${API_BASE_URL}/post/${postId}`)
    if (!response.ok) {
      throw new Error("댓글을 가져오는데 실패했습니다.")
    }
    return response.json()
  },

  // 댓글 추가
  async addComment(newComment: NewComment): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    })
    if (!response.ok) {
      throw new Error("댓글 추가에 실패했습니다.")
    }
    return response.json()
  },

  // 댓글 업데이트
  async updateComment(id: number, body: string): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    })
    if (!response.ok) {
      throw new Error("댓글 수정에 실패했습니다.")
    }
    return response.json()
  },

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("댓글 삭제에 실패했습니다.")
    }
  },

  // 댓글 좋아요
  async likeComment(id: number, likes: number): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes }),
    })
    if (!response.ok) {
      throw new Error("댓글 좋아요에 실패했습니다.")
    }
    return response.json()
  },
}
