import { create } from "zustand"
import type { Post } from "@entities/post"
import type { Comment } from "@entities/comment"

interface DialogState {
  // Post dialogs
  isAddPostOpen: boolean
  openAddPost: () => void
  closeAddPost: () => void
  
  isEditPostOpen: boolean
  editingPost: Post | null
  openEditPost: (post: Post) => void
  closeEditPost: () => void

  // Comment dialogs
  isAddCommentOpen: boolean
  postIdForAdd: number | null
  openAddComment: (postId: number) => void
  closeAddComment: () => void

  isEditCommentOpen: boolean
  editingComment: Comment | null
  openEditComment: (comment: Comment) => void
  closeEditComment: () => void

  // User dialog
  isUserDialogOpen: boolean
  userIdForDialog: number | null
  openUserDialog: (userId: number) => void
  closeUserDialog: () => void

  // PostDetail dialog
  isPostDetailOpen: boolean
  selectedPost: Post | null
  openPostDetail: (post: Post) => void
  closePostDetail: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  // Post dialogs
  isAddPostOpen: false,
  openAddPost: () => set({ isAddPostOpen: true }),
  closeAddPost: () => set({ isAddPostOpen: false }),

  isEditPostOpen: false,
  editingPost: null,
  openEditPost: (post) => set({ isEditPostOpen: true, editingPost: post }),
  closeEditPost: () => set({ isEditPostOpen: false, editingPost: null }),

  // Comment dialogs
  isAddCommentOpen: false,
  postIdForAdd: null,
  openAddComment: (postId) => set({ isAddCommentOpen: true, postIdForAdd: postId }),
  closeAddComment: () => set({ isAddCommentOpen: false, postIdForAdd: null }),

  isEditCommentOpen: false,
  editingComment: null,
  openEditComment: (comment) => set({ isEditCommentOpen: true, editingComment: comment }),
  closeEditComment: () => set({ isEditCommentOpen: false, editingComment: null }),

  // User dialog
  isUserDialogOpen: false,
  userIdForDialog: null,
  openUserDialog: (userId) => set({ isUserDialogOpen: true, userIdForDialog: userId }),
  closeUserDialog: () => set({ isUserDialogOpen: false, userIdForDialog: null }),

  // PostDetail dialog
  isPostDetailOpen: false,
  selectedPost: null,
  openPostDetail: (post) => set({ isPostDetailOpen: true, selectedPost: post }),
  closePostDetail: () => set({ isPostDetailOpen: false, selectedPost: null }),
}))
