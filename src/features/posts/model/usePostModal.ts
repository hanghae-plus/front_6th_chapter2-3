import { create } from 'zustand';
import type { Post } from '@/entities/posts';

interface PostModalState {
  opened: boolean;
  post: Post | null;
  open: (post: Post) => void;
  close: () => void;
}

export const usePostModal = create<PostModalState>((set) => {
  return {
    opened: false,
    post: null,
    open: (post: Post) => {
      set({ opened: true, post });
    },
    close: () => {
      set({ opened: false, post: null });
    },
  };
});
