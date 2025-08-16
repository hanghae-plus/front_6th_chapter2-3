import { Comment } from "../../types/comment.type"
import { URL_PATH } from "../config/routes"

export const fetchCommentsByPost = async (postId: number): Promise<{ comments: Comment[] }> => {
  const response = await fetch(URL_PATH.COMMENTS.BY_POST(postId))
  return response.json()
}

export const createComment = async (commentData: {
  body: string
  postId: number | null
  userId: number
}): Promise<Comment> => {
  const response = await fetch(URL_PATH.COMMENTS.ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  })
  return response.json()
}

export const updateComment = async (id: number, commentData: { body: string }): Promise<Comment> => {
  const response = await fetch(URL_PATH.COMMENTS.UPDATE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  })
  return response.json()
}

export const deleteComment = async (id: number): Promise<void> => {
  await fetch(URL_PATH.COMMENTS.DELETE(id), {
    method: "DELETE",
  })
}

export const likeComment = async (id: number, likes: number): Promise<Comment> => {
  const response = await fetch(URL_PATH.COMMENTS.UPDATE(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  })
  return response.json()
}
