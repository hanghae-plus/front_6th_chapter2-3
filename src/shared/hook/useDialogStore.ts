import { create } from 'zustand';

interface DialogState {
  show: boolean;
  setShow: (show: boolean) => void;
  content: React.ReactNode | null;
  setContent: (content: React.ReactNode | null) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  show: false,
  content: null,
  setShow: (show) => set({ show }),
  setContent: (content) => set({ content }),
}));
