import { apiClient } from "../../../shared/api/base"
import { Comment, CreateCommentRequest, CommentsResponse, UpdateComment } from "../model/types"

export const commentApi = {
  /** 댓글 목록 가져오기 */
  async getComments(postId: number): Promise<CommentsResponse> {
    return await apiClient.get<CommentsResponse>(`/comments/post/${postId}`)
  },

  /** 댓글 추가 */
  async addComment(newComment: CreateCommentRequest): Promise<Comment> {
    return await apiClient.post<Comment>("/comments/add", newComment)
  },

  /** 댓글 업데이트 */
  async updateComment(commentId: number, body: UpdateComment): Promise<Comment> {
    return await apiClient.put<Comment>(`/comments/${commentId}`, { body })
  },

  /** 댓글 삭제 */
  async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`)
  },

  /** 댓글 좋아요 */
  async likeComment(id: number): Promise<Comment> {
    const response = await apiClient.patch<Comment>(`/comments/${id}`, {
      likes: 1,
    })
    return response
  },
}
