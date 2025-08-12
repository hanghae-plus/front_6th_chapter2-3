import {
  Comment,
  CreateComment,
  UpdateComment,
  CommentFilter,
  CommentPaginatedResponse,
  CommentReaction,
} from "@/entities/comment/model/schema"

import { HttpClient } from "@/shared/api/http"

export const commentApi = {
  /**
   * 특정 게시물의 댓글 목록을 가져옵니다
   * @param postId - 게시물 ID
   * @param filters - 필터 옵션
   */
  async getCommentsByPost(postId: number, filters?: CommentFilter): Promise<CommentPaginatedResponse> {
    const params = new URLSearchParams()
    if (filters?.skip !== undefined) params.set("skip", filters.skip.toString())
    if (filters?.limit !== undefined) params.set("limit", filters.limit.toString())

    const queryString = params.toString()
    const url = `/api/comments/post/${postId}${queryString ? `?${queryString}` : ""}`

    return HttpClient.get<CommentPaginatedResponse>(url)
  },

  /**
   * 특정 사용자의 댓글 목록을 가져옵니다
   * @param userId - 사용자 ID
   * @param filters - 필터 옵션
   */
  async getCommentsByUser(userId: number, filters?: CommentFilter): Promise<CommentPaginatedResponse> {
    const params = new URLSearchParams()
    if (filters?.skip !== undefined) params.set("skip", filters.skip.toString())
    if (filters?.limit !== undefined) params.set("limit", filters.limit.toString())

    const queryString = params.toString()
    const url = `/api/comments/user/${userId}${queryString ? `?${queryString}` : ""}`

    return HttpClient.get<CommentPaginatedResponse>(url)
  },

  /**
   * 새 댓글을 생성합니다
   * @param data - 댓글 생성 데이터
   */
  async createComment(data: CreateComment): Promise<Comment> {
    return HttpClient.post<Comment>("/api/comments/add", data)
  },

  /**
   * 댓글을 수정합니다
   * @param id - 댓글 ID
   * @param data - 수정할 데이터
   */
  async updateComment(id: number, data: UpdateComment): Promise<Comment> {
    return HttpClient.put<Comment>(`/api/comments/${id}`, data)
  },

  /**
   * 댓글을 삭제합니다
   * @param id - 댓글 ID
   */
  async deleteComment(id: number): Promise<void> {
    return HttpClient.delete(`/api/comments/${id}`)
  },

  /**
   * 댓글의 반응(좋아요/싫어요)을 업데이트합니다
   * @param id - 댓글 ID
   * @param data - 반응 데이터
   */
  async updateCommentReaction(id: number, data: CommentReaction): Promise<Comment> {
    return HttpClient.patch<Comment>(`/api/comments/${id}`, data)
  },

  /**
   * 댓글에 좋아요를 추가합니다
   * @param id - 댓글 ID
   */
  async likeComment(id: number): Promise<Comment> {
    return HttpClient.patch<Comment>(`/api/comments/${id}`, { likes: 1 })
  },

  /**
   * 댓글에 싫어요를 추가합니다
   * @param id - 댓글 ID
   */
  async dislikeComment(id: number): Promise<Comment> {
    return HttpClient.patch<Comment>(`/api/comments/${id}`, { dislikes: 1 })
  },
}
