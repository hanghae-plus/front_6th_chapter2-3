import { create } from 'zustand';

import { CreatePost, Post, UpdatePost, postApi } from '../../../entities/post';

interface PostCrudState {
  loading: boolean;
  error: string | null;
}

interface PostCrudActions {
  addPost: (post: CreatePost) => Promise<Post>;
  updatePost: (id: number, post: UpdatePost) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostCrud = create<PostCrudState & PostCrudActions>()((set) => ({
  loading: false,
  error: null,

  addPost: async (post: CreatePost): Promise<Post> => {
    set({ loading: true, error: null });
    try {
      const newPost = await postApi.addPost(post);
      set({ loading: false });
      return newPost;
    } catch (error: any) {
      set({ loading: false, error: error.message });
      console.error('게시물 추가 오류:', error);
      throw error;
    }
  },

  updatePost: async (id: number, post: UpdatePost): Promise<Post> => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await postApi.updatePost(id, post);
      set({ loading: false });
      return updatedPost;
    } catch (error: any) {
      set({ loading: false, error: error.message });
      console.error('게시물 수정 오류:', error);
      throw error;
    }
  },

  deletePost: async (id: number): Promise<void> => {
    set({ loading: true, error: null });
    try {
      await postApi.deletePost(id);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      console.error('게시물 삭제 오류:', error);
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));