import { create } from "zustand"
import { Comment } from "../../../entities"
import { NewComment } from "../type"

export const useCommentStore = create<{
  newComment: NewComment
  selectedComment: Comment | null
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  setNewComment: (newComment: NewComment | ((prev: NewComment) => NewComment)) => void
  setSelectedComment: (selectedComment: Comment | null) => void
  setShowAddCommentDialog: (showAddCommentDialog: boolean) => void
  setShowEditCommentDialog: (showEditCommentDialog: boolean) => void
}>((set) => ({
  newComment: { body: "", postId: 0, userId: 1 },
  comments: {},
  selectedComment: null,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  setSelectedComment: (selectedComment: Comment | null) => {
    set((state) => ({ ...state, selectedComment }))
  },
  setNewComment: (newComment: NewComment | ((prev: NewComment) => NewComment)) => {
    set((state) => ({
      ...state,
      newComment: typeof newComment === "function" ? newComment(state.newComment) : newComment,
    }))
  },
  setShowAddCommentDialog: (showAddCommentDialog: boolean) => {
    set((state) => ({ ...state, showAddCommentDialog }))
  },
  setShowEditCommentDialog: (showEditCommentDialog: boolean) => {
    set((state) => ({ ...state, showEditCommentDialog }))
  },
}))
