import { create } from 'zustand';

import { CreatePost } from '../../../entities/post';

interface PostFormState {
  newPost: CreatePost;
}

interface PostFormActions {
  setNewPost: (post: CreatePost) => void;
  resetNewPost: () => void;
}

export const usePostForm = create<PostFormState & PostFormActions>((set) => ({
  newPost: { title: '', body: '', userId: 1 },

  setNewPost: (post: CreatePost) => set({ newPost: post }),
  resetNewPost: () => set({ newPost: { title: '', body: '', userId: 1 } }),
}));