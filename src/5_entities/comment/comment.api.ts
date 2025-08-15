import { ApiService } from '@/shared/lib';

import {
  Comment,
  CommentToCreate,
  CreatedComment,
  DeletedComment,
  GetCommentsResponse,
} from './comment.type';

export const getComments = async (
  postId: number
): Promise<GetCommentsResponse> => {
  return ApiService.get<GetCommentsResponse>(`/comments/post/${postId}`);
};

export const createComment = async (
  newComment: CommentToCreate
): Promise<CreatedComment> => {
  return ApiService.post<CreatedComment>('/comments/add', newComment);
};

export const updateComment = async (
  updatedComment: Comment
): Promise<{ body: string }> => {
  return ApiService.put<{ body: string }>(`/comments/${updatedComment.id}`, {
    body: updatedComment.body,
  });
};

export const patchComment = async (
  updatedComment: Partial<Comment>,
  commentId: number
): Promise<Comment> => {
  return ApiService.put<Comment>(`/comments/${commentId}`, updatedComment);
};

export const deleteComment = async (
  commentId: number
): Promise<DeletedComment> => {
  return ApiService.delete<DeletedComment>(`/comments/${commentId}`);
};
