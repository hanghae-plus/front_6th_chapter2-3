import { Comment, NewComment } from "@entities/comment/model/types"

export const fetchComments = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  return response.json()
}

export const addComment = async (comment: NewComment): Promise<Comment> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  return response.json()
}

export const updateComment = async (id: number, body: string): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
  return response.json()
}

export const deleteComment = async (id: number): Promise<void> => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
}

// 버그 수정: API에서 반환된 데이터를 그대로 사용하도록 수정
export const likeComment = async (id: number, currentLikes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  return response.json()
}
