import { create } from 'zustand';
import type { Post } from '@/entities/posts';

interface EditPostDialogState {
  opened: boolean;
  data: Post | null;
  open: (data: Post) => void;
  close: () => void;
}

export const useEditPostDialog = create<EditPostDialogState>((set) => {
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
