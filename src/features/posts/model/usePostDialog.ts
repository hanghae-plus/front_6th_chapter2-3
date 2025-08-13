import { create } from 'zustand';
import type { Post } from '@/entities/posts';

interface PostDialogState {
  opened: boolean;
  data: Post | null;
  open: (data: Post) => void;
  close: () => void;
}

export const usePostDialog = create<PostDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: Post) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});
