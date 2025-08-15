import {
  AddComment,
  AddCommentResponse,
  CommentResponse,
  UpdateComment,
  UpdateCommentRequest,
} from "@/features/comment-management/types"
import { http } from "@/shared/lib"

export const commentApi = {
  getComments: (postId?: number) => http.get<CommentResponse>(`/comments/post/${postId}`),
  addComment: (comment: AddComment) => http.post<AddComment, AddCommentResponse>(`/comments/add`, comment),
  updateComment: (comment: UpdateComment) =>
    http.put<UpdateCommentRequest, UpdateComment>(`/comments/${comment.id}`, { body: comment.body }),
  deleteComment: (id: number) => http.del<{ id: number; postId: number }>(`/comments/${id}`),
  likeComment: (id: number, currentLikes: number) =>
    http.patch<{ currentLikes: number; id: number; postId: number }>(`/comments/${id}`, {
      likes: currentLikes + 1,
    }),
}
