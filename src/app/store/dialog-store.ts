import { create } from "zustand"
import type { Post } from "@entities/post"
import type { Comment } from "@entities/comment"
import type { StateCreator } from "zustand"

/* ---------- Post slice ---------- */
interface PostDialogSlice {
  /* add */
  isAddPostOpen: boolean
  openAddPost: () => void
  closeAddPost: () => void
  /* edit */
  isEditPostOpen: boolean
  editingPost: Post | null
  openEditPost: (post: Post) => void
  closeEditPost: () => void
}

type DialogState = PostDialogSlice & CommentDialogSlice

const createPostSlice: StateCreator<DialogState, [], [], PostDialogSlice> = (set) => {
  return {
    isAddPostOpen: false,
    openAddPost: () => set({ isAddPostOpen: true }),
    closeAddPost: () => set({ isAddPostOpen: false }),

    isEditPostOpen: false,
    editingPost: null,
    openEditPost: (post) => set({ isEditPostOpen: true, editingPost: post }),
    closeEditPost: () => set({ isEditPostOpen: false, editingPost: null }),
  }
}

/* ---------- Comment slice ---------- */
interface CommentDialogSlice {
  isAddCommentOpen: boolean
  postIdForAdd: number | null
  openAddComment: (postId: number) => void
  closeAddComment: () => void

  isEditCommentOpen: boolean
  editingComment: Comment | null
  openEditComment: (comment: Comment) => void
  closeEditComment: () => void
}

const createCommentSlice: StateCreator<DialogState, [], [], CommentDialogSlice> = (set) => {
  return {
    isAddCommentOpen: false,
    postIdForAdd: null,
    openAddComment: (postId) => set({ isAddCommentOpen: true, postIdForAdd: postId }),
    closeAddComment: () => set({ isAddCommentOpen: false, postIdForAdd: null }),

    isEditCommentOpen: false,
    editingComment: null,
    openEditComment: (comment) => set({ isEditCommentOpen: true, editingComment: comment }),
    closeEditComment: () => set({ isEditCommentOpen: false, editingComment: null }),
  }
}

/* ---------- Store ---------- */
export const useDialogStore = create<DialogState>()((set, get, store) => ({
  ...createPostSlice(set, get, store),
  ...createCommentSlice(set, get, store),
}))
