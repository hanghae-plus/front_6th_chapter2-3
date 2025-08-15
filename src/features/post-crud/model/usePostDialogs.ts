import { create } from 'zustand';

import { Post } from '../../../entities/post';

interface PostDialogsState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  selectedPost: Post | null;
}

interface PostDialogsActions {
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (post: Post) => void;
  closeEditDialog: () => void;
  setSelectedPost: (post: Post | null) => void;
}

export const usePostDialogs = create<PostDialogsState & PostDialogsActions>()((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  selectedPost: null,

  openAddDialog: () => set({ 
    showAddDialog: true,
    selectedPost: null 
  }),

  closeAddDialog: () => set({ 
    showAddDialog: false 
  }),

  openEditDialog: (post: Post) => set({ 
    showEditDialog: true,
    selectedPost: post 
  }),

  closeEditDialog: () => set({ 
    showEditDialog: false,
    selectedPost: null 
  }),

  setSelectedPost: (post: Post | null) => set({ selectedPost: post }),
}));