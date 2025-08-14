import { PaginationResponse } from '@/shared/types';

import { Comment, CreatedComment, DeletedComment } from './comment.type';

interface GetCommentsResponse extends PaginationResponse {
  comments: Comment[];
}

export const getComments = async (
  postId: number
): Promise<GetCommentsResponse> => {
  const response = await fetch(`/api/comments/post/${postId}`);
  return response.json();
};

export const createComment = async (
  newComment: Omit<Comment, 'id'>
): Promise<CreatedComment> => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });
  return response.json();
};

export const updateComment = async (
  updatedComment: Comment
): Promise<Comment> => {
  const response = await fetch(`/api/comments/${updatedComment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedComment),
  });
  return response.json();
};

export const patchComment = async (
  updatedComment: Comment
): Promise<Comment> => {
  const response = await fetch(`/api/comments/${updatedComment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedComment),
  });
  return response.json();
};

export const deleteComment = async (
  commentId: number
): Promise<DeletedComment> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
  return response.json();
};
