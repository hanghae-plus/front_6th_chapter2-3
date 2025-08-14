import { create } from 'zustand';

import { NewPostPayload } from '@/entities/post/model/types';

interface CreatePostState {
  isDialogOpen: boolean;
  newPost: NewPostPayload;
  openDialog: () => void;
  closeDialog: () => void;
  setNewPost: (post: NewPostPayload) => void;
}

const initialNewPost = { title: '', body: '', userId: 1 };

export const useCreatePostStore = create<CreatePostState>((set) => ({
  isDialogOpen: false,
  newPost: initialNewPost,

  openDialog: () => set({ isDialogOpen: true, newPost: initialNewPost }),
  closeDialog: () => set({ isDialogOpen: false }),
  setNewPost: (post) => set({ newPost: post }),
}));
