import { NewComment } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 순수한 API 호출 함수들 (상태 관리 로직 제거)
export const fetchComments = async (postId: number) => {
  const response = await httpClient.get(`/api/comments/post/${postId}`);
  return response.json();
};

export const addComment = async (comment: NewComment) => {
  const response = await httpClient.post('/api/comments/add', comment);
  return response.json();
};

export const updateComment = async (id: number, body: string) => {
  const response = await httpClient.put(`/api/comments/${id}`, { body });
  return response.json();
};

export const deleteComment = async (id: number) => {
  const response = await httpClient.delete(`/api/comments/${id}`);
  return response.json();
};

export const likeComment = async (id: number, likes: number) => {
  const response = await httpClient.patch(`/api/comments/${id}`, { likes: likes + 1 });
  return response.json();
};
