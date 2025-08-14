import { api } from '@/shared/lib/api.ts';

import { Post, PostsAddRequest, PostsResponse } from '../model/types.ts';

/**
 * Posts API - 게시물 관련 로직만 처리 (사용자 데이터 제외)
 */
const postsApi = {
  /**
   * 게시물 목록 조회 (순수 게시물 데이터만)
   */
  getPosts: async ({
    limit = 0,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
  } = {}): Promise<PostsResponse> => {
    return api.get<PostsResponse>('/posts', { params: { limit, skip } });
  },

  /**
   * 단일 게시물 조회
   */
  getPost: async (id: number): Promise<Post> => {
    return api.get<Post>(`/posts/${id}`);
  },

  /**
   * 게시물 생성
   */
  createPost: async (postData: PostsAddRequest): Promise<Post> => {
    return api.post<Post, PostsAddRequest>('/posts/add', postData);
  },

  /**
   * 게시물 수정
   */
  updatePost: async (id: number, postData: Partial<Post>): Promise<Post> => {
    return api.put<Post, Partial<Post>>(`/posts/${id}`, postData);
  },

  /**
   * 게시물 부분 수정
   */
  patchPost: async (id: number, partialData: Partial<Post>): Promise<Post> => {
    return api.patch<Post, Partial<Post>>(`/posts/${id}`, partialData);
  },

  /**
   * 게시물 삭제
   */
  deletePost: async (id: number): Promise<void> => {
    return api.delete<void>(`/posts/${id}`);
  },

  /**
   * 게시물 검색
   */
  searchPosts: async (query: string): Promise<PostsResponse> => {
    return api.get<PostsResponse>('/posts/search', { params: { q: query } });
  },

  /**
   * 태그별 게시물 조회
   */
  getPostsByTag: async (tag: string): Promise<PostsResponse> => {
    return api.get<PostsResponse>(`/posts/tag/${tag}`);
  },

  /**
   * 특정 사용자의 게시물 조회
   */
  getPostsByUser: async (userId: number): Promise<PostsResponse> => {
    return api.get<PostsResponse>(`/posts/user/${userId}`);
  },

  /**
   * 사용 가능한 태그 목록 조회
   */
  getTags: async (): Promise<string[]> => {
    return api.get<string[]>('/posts/tags');
  },
};

// 기존 getPosts 함수는 제거하고 postsApi.getPosts 사용

export default postsApi;
