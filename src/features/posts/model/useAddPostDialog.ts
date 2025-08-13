import { create } from 'zustand';

interface AddPostDialogState {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const useAddPostDialog = create<AddPostDialogState>((set) => {
  return {
    opened: false,
    open: () => {
      set({ opened: true });
    },
    close: () => {
      set({ opened: false });
    },
  };
});
