import { Comment } from '../model/types';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/comments`;

export const fetchCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/post/${postId}`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  const data = await response.json();
  return data.comments;
};

export const addComment = async (newComment: {
  body: string;
  postId: number;
  userId: number;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

export const updateComment = async ({
  commentId,
  body,
}: {
  commentId: number;
  body: string;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!response.ok) throw new Error('Failed to update comment');
  return response.json();
};

export const deleteComment = async (commentId: number): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comment');
  return response.json();
};

export const likeComment = async ({
  commentId,
  currentLikes,
}: {
  commentId: number;
  currentLikes: number;
}): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  });
  if (!response.ok) throw new Error('Failed to like comment');
  return response.json();
};
