import type * as CommentModels from "@/entities/comment/model"
import { fetcher } from "@/shared/api"

export async function fetchCommentsByPostId({ postId }: CommentModels.FetchCommentsByPostId.Payload) {
  const response = await fetcher.get(`/comments/post/${postId}`)
  return response.json<CommentModels.FetchCommentsByPostId.Response>()
}

export async function addComment(payload: CommentModels.AddComment.Payload) {
  const response = await fetcher.post(`/comments/add`, { body: payload })
  return response.json<CommentModels.AddComment.Response>()
}

export async function updateComment({ commentId, ...body }: CommentModels.UpdateComment.Payload) {
  const response = await fetcher.put(`/comments/${commentId}`, { body })
  return response.json<CommentModels.UpdateComment.Response>()
}

export async function patchComment({ commentId, ...body }: CommentModels.PatchComment.Payload) {
  const response = await fetcher.patch(`/comments/${commentId}`, { body })
  return response.json<CommentModels.PatchComment.Response>()
}

export async function deleteComment({ commentId }: CommentModels.DeleteComment.Payload) {
  const response = await fetcher.delete(`/comments/${commentId}`)
  return response.json<CommentModels.DeleteComment.Response>()
}
