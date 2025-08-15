import { create } from 'zustand';

import { Post } from '@/entities/post/model/types';

interface ViewPostState {
  isDialogOpen: boolean;
  postToView: Post | null;
  openDialog: (post: Post) => void;
  closeDialog: () => void;
}

export const useViewPostStore = create<ViewPostState>((set) => ({
  isDialogOpen: false,
  postToView: null,
  openDialog: (post) => set({ isDialogOpen: true, postToView: post }),
  closeDialog: () => set({ isDialogOpen: false, postToView: null }),
}));
