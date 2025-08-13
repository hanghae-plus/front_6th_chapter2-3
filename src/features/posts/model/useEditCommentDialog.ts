import { create } from 'zustand';
import type { PostComment } from '@/entities/posts';

interface EditCommentDialogState {
  opened: boolean;
  data: PostComment | null;
  open: (data: PostComment) => void;
  close: () => void;
}

export const useEditCommentDialog = create<EditCommentDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: PostComment) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});
