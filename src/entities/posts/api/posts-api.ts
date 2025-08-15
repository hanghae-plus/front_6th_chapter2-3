import { CreatePostData, FetchPostsParams, Post, PostListResponse } from "../model/types";
const BASE_URL = '/api/posts';
const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;

export const postsApi = {
  // 기본 게시물 목록 가져오기
  getPosts: async (params: FetchPostsParams): Promise<PostListResponse> => {
    const { limit = DEFAULT_LIMIT, skip = DEFAULT_SKIP } = params;
    const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error('게시물 가져오기 오류: ' + response.statusText);
    return response.json();
  },

  // 태그 목록 가져오기
  getTags: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/tags`);
    if (!response.ok) throw new Error('태그 가져오기 오류: ' + response.statusText);
    const data = await response.json();
    return data;
  },

  // 검색
  searchPosts: async (query: string): Promise<PostListResponse> => {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('검색 오류: ' + response.statusText);
    return response.json();
  },

  // 태그별 게시물 가져오기
  getPostsByTag: async (tag: string): Promise<PostListResponse> => {
    const response = await fetch(`${BASE_URL}/tag/${encodeURIComponent(tag)}`);
    if (!response.ok) throw new Error('태그별 게시물 가져오기 오류: ' + response.statusText);
    return response.json()
  },

  // 게시물 추가
  create: async (postData: CreatePostData): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('게시물 추가 오류: ' + response.statusText);
    return response.json();
  },

  // 게시물 수정
  update: async (postData: Post): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/${postData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('게시물 수정 오류: ' + response.statusText);
    return response.json();
  },

  // 게시물 삭제
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('게시물 삭제 오류: ' + response.statusText);
  },
}