import { NewComment } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 특정 게시글의 댓글 목록 조회
export const fetchComments = async (postId: number) => {
  const response = await httpClient.get(`/api/comments/post/${postId}`);
  return response.json();
};

// 새 댓글 추가
export const addComment = async (comment: NewComment) => {
  const response = await httpClient.post('/api/comments/add', comment);
  return response.json();
};

// 댓글 내용 수정
export const updateComment = async (id: number, body: string) => {
  const response = await httpClient.put(`/api/comments/${id}`, { body });
  return response.json();
};

// 댓글 삭제
export const deleteComment = async (id: number) => {
  const response = await httpClient.delete(`/api/comments/${id}`);
  return response.json();
};

// 댓글 좋아요 (좋아요 수 증가)
export const likeComment = async (id: number, likes: number) => {
  const response = await httpClient.patch(`/api/comments/${id}`, { likes: likes + 1 });
  return response.json();
};
