import { create } from 'zustand';
import { NewPostAddedRequest } from '@/entities/posts';

export const useNewPostStore = create<NewPostAddedRequest>((set) => ({
  newPost: { title: '', body: '', userId: 1 },
  setNewPost: (post) => set({ newPost: post }),
  resetNewPost: () => set({ newPost: { title: '', body: '', userId: 1 } }),
}));
