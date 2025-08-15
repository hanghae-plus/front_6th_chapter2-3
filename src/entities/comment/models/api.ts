import { api } from "../../../shared/api/client";
import type { Comment, CommentsResponse } from "./types";

interface GetCommentsParams {
  postId: number;
}
export const getComments = async ({ postId }: GetCommentsParams): Promise<CommentsResponse> => {
  return api<CommentsResponse>(`/comments/post/${postId}`);
};

interface AddCommentParams {
  comment: Partial<Comment>;
}
export const addComment = async ({ comment }: AddCommentParams): Promise<Comment> => {
  return api<Omit<Comment, "likes">>(`/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
};

interface UpdateCommentParams {
  comment: Comment;
}
export const updateComment = async ({ comment }: UpdateCommentParams): Promise<Comment> => {
  return api<Comment>(`/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  });
};

interface DeleteCommentParams {
  id: number;
}
export const deleteComment = async ({ id }: DeleteCommentParams): Promise<void> => {
  return api<void>(`/comments/${id}`, {
    method: "DELETE",
  });
};

interface LikeCommentParams {
  id: number;
  likes: number;
}
export const likeComment = async ({ id, likes }: LikeCommentParams): Promise<Comment> => {
  return api<Comment>(`/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes }),
  });
};
