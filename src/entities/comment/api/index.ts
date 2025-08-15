import { NewComment } from '../types';

// 순수한 API 호출 함수들 (상태 관리 로직 제거)
export const fetchComments = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`);
  return response.json();
};

export const addComment = async (comment: NewComment) => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  return response.json();
};

export const updateComment = async (id: number, body: string) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  return response.json();
};

export const deleteComment = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const likeComment = async (id: number, likes: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: likes + 1 }),
  });
  return response.json();
};
