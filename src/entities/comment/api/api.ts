import { Comment, Comments, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from "../model/types"
import { api } from "../../../shared/api/axios"

export const getComments = async (postId: number): Promise<CommentsResponse> => {
  return api.get(`/posts/${postId}/comments`)
}

export const createComment = async (newComment: CreateCommentRequest): Promise<Comment> => {
  return api.post("/comments", newComment)
}

export const updateComment = async (id: number, body: UpdateCommentRequest): Promise<Comment> => {
  return api.put(`/comments/${id}`, body)
}

export const deleteComment = async (id: number): Promise<void> => {
  return api.delete(`/comments/${id}`)
}

export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  return api.patch(`/comments/${id}/like`, {likes: currentLikes + 1})
}