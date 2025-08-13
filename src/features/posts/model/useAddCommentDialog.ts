import { create } from 'zustand';

interface AddComment {
  postId: number;
  userId: number;
}

interface AddCommentDialogState {
  opened: boolean;
  data: AddComment | null;
  open: (data: AddComment) => void;
  close: () => void;
}

export const useAddCommentDialog = create<AddCommentDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: AddComment) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});
