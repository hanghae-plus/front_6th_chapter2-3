import { create } from 'zustand';
import { Post, NewPost } from '../../../entities/post';

interface PostStore {
  // Phase 1: 기본 데이터 상태 (기존 API 함수들과 호환)
  posts: Post[];
  selectedPost: Post | null;
  newPost: NewPost;
  
  // Phase 1: 기본 setState 함수들 (기존 API 함수들과 호환)
  setPosts: (posts: Post[]) => void;
  setSelectedPost: (post: Post | null) => void;
  setNewPost: (post: NewPost) => void;
  
  // Phase 1: 기본 초기화 함수들
  clearNewPost: () => void;
  clearSelectedPost: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  // Phase 1: 기본 초기값 (기존과 동일)
  posts: [],
  selectedPost: null,
  newPost: { title: '', body: '', userId: 1 },

  // Phase 1: 기본 setState 함수들 (기존 API 함수들과 호환)
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  setNewPost: (post) => set({ newPost: post }),

  // Phase 1: 기본 초기화 함수들
  clearNewPost: () => set({ newPost: { title: '', body: '', userId: 1 } }),
  clearSelectedPost: () => set({ selectedPost: null }),
}));
