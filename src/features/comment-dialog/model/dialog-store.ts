import { create } from "zustand"
import type { Comment } from "@entities/comment"

interface CommentDialogState {
  // Add Comment Dialog
  isAddCommentOpen: boolean
  postIdForAdd: number | null
  openAddComment: (postId: number) => void
  closeAddComment: () => void

  // Edit Comment Dialog
  isEditCommentOpen: boolean
  editingComment: Comment | null
  openEditComment: (comment: Comment) => void
  closeEditComment: () => void
}

export const useCommentDialogStore = create<CommentDialogState>((set) => ({
  // Add Comment Dialog
  isAddCommentOpen: false,
  postIdForAdd: null,
  openAddComment: (postId) => set({ isAddCommentOpen: true, postIdForAdd: postId }),
  closeAddComment: () => set({ isAddCommentOpen: false, postIdForAdd: null }),

  // Edit Comment Dialog
  isEditCommentOpen: false,
  editingComment: null,
  openEditComment: (comment) => set({ isEditCommentOpen: true, editingComment: comment }),
  closeEditComment: () => set({ isEditCommentOpen: false, editingComment: null }),
}))