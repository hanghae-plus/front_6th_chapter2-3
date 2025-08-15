import type { Comment } from "./types"

export type CommentsByPost = { comments: Comment[] }

export const insertTop = (data: CommentsByPost, comment: Comment): CommentsByPost => ({
  ...data,
  comments: [comment, ...(data.comments ?? [])],
})

export const updateById = (data: CommentsByPost, id: number, patch: (c: Comment) => Comment): CommentsByPost => ({
  ...data,
  comments: (data.comments ?? []).map((c) => (c.id === id ? patch(c) : c)),
})

export const deleteById = (data: CommentsByPost, id: number): CommentsByPost => ({
  ...data,
  comments: (data.comments ?? []).filter((c) => c.id !== id),
})

