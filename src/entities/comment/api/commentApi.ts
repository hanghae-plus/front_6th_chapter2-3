import { Comment, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from "../model/types.ts"
import { api } from "../../../shared/api/axios"

export const getComments = async (postId: number): Promise<CommentsResponse> => {
  return api.get(`/comments/post/${postId}`)
}

export const createComment = async (newComment: CreateCommentRequest): Promise<Comment> => {
  return api.post("/comments/add", newComment)
}

export const updateComment = async (id: number, body: Pick<UpdateCommentRequest, "body">): Promise<Comment> => {
  return api.put(`/comments/${id}`, body)
}

export const deleteComment = async (id: number): Promise<void> => {
  return api.delete(`/comments/${id}`)
}

export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  return api.patch(`/comments/${id}`, {likes: currentLikes + 1})
}