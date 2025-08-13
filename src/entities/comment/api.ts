import { apiRequest } from "@/shared/api/base"

import type { Comment } from "./model"

export const commentApi = {
  getCommentsByPostId: (postId: number) => apiRequest<{ comments: Comment[] }>(`/comments/post/${postId}`),

  createComment: (comment: Omit<Comment, "id" | "user">) =>
    apiRequest<Comment>("/comments/add", {
      method: "POST",
      body: JSON.stringify(comment),
    }),

  updateComment: (id: number, body: string) =>
    apiRequest<Comment>(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    }),

  deleteComment: (id: number) =>
    apiRequest(`/comments/${id}`, {
      method: "DELETE",
    }),

  likeComment: (id: number, likes: number) =>
    apiRequest<Comment>(`/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ likes }),
    }),
}
