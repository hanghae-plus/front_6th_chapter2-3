import { Comment } from "../model/types"

// 특정 게시물의 댓글을 가져오는 API 함수
export const getCommentsByPostIdApi = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  if (!response.ok) {
    throw new Error("댓글을 가져오는데 실패했습니다.")
  }
  return response
}

// 댓글 추가 API 함수
export const addCommentApi = async (newComment: Comment) => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  if (!response.ok) {
    throw new Error("댓글 추가에 실패했습니다.")
  }
  return response
}

// 댓글 수정 API 함수
export const updateCommentApi = async (comment: Comment) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  if (!response.ok) {
    throw new Error("댓글 수정에 실패했습니다.")
  }
  return response
}

// 댓글 삭제 API 함수
export const deleteCommentApi = async (id: string) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("댓글 삭제에 실패했습니다.")
  }
  return response
}

// 댓글 좋아요 API 함수
export const likeCommentApi = async (id: number, likes: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  })
  if (!response.ok) {
    throw new Error("댓글 좋아요에 실패했습니다.")
  }
  return response
}
