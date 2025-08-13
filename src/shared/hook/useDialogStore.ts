import { create } from 'zustand';

interface DialogState {
  postModal: { show: boolean; content: React.ReactNode | null };
  commentModal: { show: boolean; content: React.ReactNode | null };
  setPostModal: (modal: DialogState['postModal']) => void;
  setCommentModal: (modal: DialogState['commentModal']) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  postModal: { show: false, content: null },
  commentModal: { show: false, content: null },
  setPostModal: (modal) => set({ postModal: modal }),
  setCommentModal: (modal) => set({ commentModal: modal }),
}));
