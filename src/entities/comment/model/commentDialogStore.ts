import { create } from 'zustand';

import { Comment } from '@/entities/comment/model/types';

interface CommentDialogState {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  commentToEdit: Comment | null;
  newCommentBody: string;

  openAddDialog: () => void;
  openEditDialog: (comment: Comment) => void;
  closeDialogs: () => void;
  setCommentToEdit: (comment: Comment) => void;
  setNewCommentBody: (body: string) => void;
}

export const useCommentDialogStore = create<CommentDialogState>((set) => ({
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  commentToEdit: null,
  newCommentBody: '',

  openAddDialog: () => set({ isAddDialogOpen: true, newCommentBody: '' }),
  openEditDialog: (comment) => set({ isEditDialogOpen: true, commentToEdit: comment }),
  closeDialogs: () => set({ isAddDialogOpen: false, isEditDialogOpen: false, commentToEdit: null }),
  setCommentToEdit: (comment) => set({ commentToEdit: comment }),
  setNewCommentBody: (body) => set({ newCommentBody: body }),
}));
