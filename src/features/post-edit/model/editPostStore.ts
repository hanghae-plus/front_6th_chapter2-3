import { create } from 'zustand';

import { Post } from '@/entities/post/model/types';

interface EditPostState {
  isDialogOpen: boolean;
  postToEdit: Post | null;
  setPostToEdit: (post: Post) => void;
  openDialog: (post: Post) => void;
  closeDialog: () => void;
}

export const useEditPostStore = create<EditPostState>((set) => ({
  isDialogOpen: false,
  postToEdit: null,
  setPostToEdit: (post) => set({ postToEdit: post }),
  openDialog: (post) => set({ isDialogOpen: true, postToEdit: post }),
  closeDialog: () => set({ isDialogOpen: false, postToEdit: null }),
}));
