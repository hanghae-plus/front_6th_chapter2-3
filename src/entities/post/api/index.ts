import { Post, NewPost } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 순수한 API 호출 함수들 (상태 관리 로직 제거)
export const fetchPosts = async (limit: number, skip: number) => {
  const response = await httpClient.get(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
};

export const searchPosts = async (query: string) => {
  const response = await httpClient.get(`/api/posts/search?q=${query}`);
  return response.json();
};

export const fetchPostsByTag = async (tag: string) => {
  const response = await httpClient.get(`/api/posts/tag/${tag}`);
  return response.json();
};

export const addPost = async (post: NewPost) => {
  const response = await httpClient.post('/api/posts/add', post);
  return response.json();
};

export const updatePost = async (id: number, post: Partial<Post>) => {
  const response = await httpClient.put(`/api/posts/${id}`, post);
  return response.json();
};

export const deletePost = async (id: number) => {
  const response = await httpClient.delete(`/api/posts/${id}`);
  return response;
};
