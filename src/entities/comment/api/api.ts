import { http } from "../../../shared/lib/http-client"
import type { CommentItem } from "../model"

export interface CommentsResponse {
  comments: CommentItem[]
}

export const commentApi = {
  getComments: async (postId: number): Promise<CommentsResponse> => {
    return http.get<CommentsResponse>(`/comments/post/${postId}`)
  },

  addComment: async (comment: Omit<CommentItem, "id">): Promise<CommentItem> => {
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
