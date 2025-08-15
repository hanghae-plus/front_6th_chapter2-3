import { create } from 'zustand';
import { Post } from '@/entities/posts';

interface SelectedPostState {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

export const useSelectedPostStore = create<SelectedPostState>((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));
