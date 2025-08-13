import type { CommentFilter, CommentPaginatedResponse } from "@/shared/types/comment.type"
import { HttpClient } from "@/shared/api/http"

/**
 * 특정 게시물의 댓글 목록을 가져옵니다
 * @param postId - 게시물 ID
 * @param filters - 필터 옵션
 */
export const getCommentsByPost = async (postId: number, filters?: CommentFilter): Promise<CommentPaginatedResponse> => {
  const params = new URLSearchParams()
  if (filters?.skip !== undefined) params.set("skip", filters.skip.toString())
  if (filters?.limit !== undefined) params.set("limit", filters.limit.toString())

  const queryString = params.toString()
  const url = `/api/comments/post/${postId}${queryString ? `?${queryString}` : ""}`

  return HttpClient.get<CommentPaginatedResponse>(url)
}

/**
 * 특정 사용자의 댓글 목록을 가져옵니다
 * @param userId - 사용자 ID
 * @param filters - 필터 옵션
 */
export const getCommentsByUser = async (userId: number, filters?: CommentFilter): Promise<CommentPaginatedResponse> => {
  const params = new URLSearchParams()
  if (filters?.skip !== undefined) params.set("skip", filters.skip.toString())
  if (filters?.limit !== undefined) params.set("limit", filters.limit.toString())

  const queryString = params.toString()
  const url = `/api/comments/user/${userId}${queryString ? `?${queryString}` : ""}`

  return HttpClient.get<CommentPaginatedResponse>(url)
}
