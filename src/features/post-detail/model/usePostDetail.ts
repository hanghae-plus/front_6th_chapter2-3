import { create } from 'zustand';

import { Post } from '../../../entities/post';

interface PostDetailState {
  showPostDetailDialog: boolean;
  selectedPost: Post | null;
}

interface PostDetailActions {
  openPostDetail: (post: Post) => void;
  closePostDetail: () => void;
  setShowPostDetailDialog: (show: boolean) => void;
  setSelectedPost: (post: Post | null) => void;
}

export const usePostDetail = create<PostDetailState & PostDetailActions>((set) => ({
  showPostDetailDialog: false,
  selectedPost: null,

  openPostDetail: (post: Post) => set({ 
    selectedPost: post, 
    showPostDetailDialog: true 
  }),

  closePostDetail: () => set({ 
    showPostDetailDialog: false, 
    selectedPost: null 
  }),

  setShowPostDetailDialog: (show: boolean) => set({ showPostDetailDialog: show }),
  setSelectedPost: (post: Post | null) => set({ selectedPost: post }),
}));