import { create } from "zustand"
import type { Post } from "@entities/post"

interface PostDialogState {
  // Add Post Dialog
  isAddPostOpen: boolean
  openAddPost: () => void
  closeAddPost: () => void
  
  // Edit Post Dialog
  isEditPostOpen: boolean
  editingPost: Post | null
  openEditPost: (post: Post) => void
  closeEditPost: () => void

  // Post Detail Dialog
  isPostDetailOpen: boolean
  selectedPost: Post | null
  openPostDetail: (post: Post) => void
  closePostDetail: () => void
}

export const usePostDialogStore = create<PostDialogState>((set) => ({
  // Add Post Dialog
  isAddPostOpen: false,
  openAddPost: () => set({ isAddPostOpen: true }),
  closeAddPost: () => set({ isAddPostOpen: false }),

  // Edit Post Dialog
  isEditPostOpen: false,
  editingPost: null,
  openEditPost: (post) => set({ isEditPostOpen: true, editingPost: post }),
  closeEditPost: () => set({ isEditPostOpen: false, editingPost: null }),

  // Post Detail Dialog
  isPostDetailOpen: false,
  selectedPost: null,
  openPostDetail: (post) => set({ isPostDetailOpen: true, selectedPost: post }),
  closePostDetail: () => set({ isPostDetailOpen: false, selectedPost: null }),
}))