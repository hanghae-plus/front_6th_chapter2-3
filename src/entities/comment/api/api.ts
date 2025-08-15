import { http } from "@shared/lib/httpClient"
import type { CommentItem } from "../model"

export interface CommentsResponse {
  comments: CommentItem[]
  total: number
}

export interface AddCommentRequest {
  body: string
  postId: number
  userId: number
}

export interface AddCommentResponse {
  body: string
  postId: number
  userId: number
}

export const commentApi = {
  getComments: async (postId: number): Promise<CommentsResponse> => {
    return http.get<CommentsResponse>(`/comments/post/${postId}`)
  },

  addComment: async (comment: AddCommentRequest): Promise<CommentItem> => {
    return http.post<CommentItem>("/comments/add", comment)
  },

  updateComment: async (id: number, body: string): Promise<CommentItem> => {
    return http.put<CommentItem>(`/comments/${id}`, { body })
  },

  deleteComment: async (id: number): Promise<void> => {
    return http.delete<void>(`/comments/${id}`)
  },

  likeComment: async (id: number, likes: number): Promise<CommentItem> => {
    return http.patch<CommentItem>(`/comments/${id}`, { likes })
  },
}
