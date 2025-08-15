import { apiClient } from "@/shared/api/apiClient"

import { AddCommentResponse, Comment, CommentRequest, CommentResponse, DeleteCommentResponse } from "../model/types"

export const commentApi = {
  async create(newComment: CommentRequest) {
    return apiClient.post<AddCommentResponse>("/comments/add", newComment)
  },
  async delete(commentId: number) {
    return apiClient.delete<DeleteCommentResponse>(`/comments/${commentId}`)
  },
  async getByPostId(postId: number) {
    return apiClient.get<CommentResponse>(`/comments/post/${postId}`)
  },
  async update(comment: Comment) {
    return apiClient.put<Comment>(`/comments/${comment.id}`, { body: comment.body })
  },
  async updateLike(comment: Comment) {
    return apiClient.patch<Comment>(`/comments/${comment.id}`, { likes: comment.likes })
  },
}
