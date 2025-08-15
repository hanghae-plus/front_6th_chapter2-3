import { Post, NewPost } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 게시글 목록 조회 (페이지네이션 지원)
export const fetchPosts = async (limit: number, skip: number) => {
  const response = await httpClient.get(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
};

// 게시글 검색 (제목/내용 기반)
export const searchPosts = async (query: string) => {
  const response = await httpClient.get(`/api/posts/search?q=${query}`);
  return response.json();
};

// 특정 태그의 게시글 조회
export const fetchPostsByTag = async (tag: string) => {
  const response = await httpClient.get(`/api/posts/tag/${tag}`);
  return response.json();
};

// 새 게시글 생성
export const addPost = async (post: NewPost) => {
  const response = await httpClient.post('/api/posts/add', post);
  return response.json();
};

// 게시글 수정
export const updatePost = async (id: number, post: Partial<Post>) => {
  const response = await httpClient.put(`/api/posts/${id}`, post);
  return response.json();
};

// 게시글 삭제
export const deletePost = async (id: number) => {
  const response = await httpClient.delete(`/api/posts/${id}`);
  return response;
};
