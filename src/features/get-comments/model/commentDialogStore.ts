import { create } from "zustand"

import type { Comment } from "@/entities/comment/model"

interface State {
  selectedComment: Comment | null
  addCommentPostId: number | null
}

interface Actions {
  actions: {
    setSelectedComment: (comment: Comment | null) => void
    setAddCommentPostId: (postId: number | null) => void
    resetState: (keys?: Array<keyof State>) => void
  }
}

const initialState: State = {
  selectedComment: null,
  addCommentPostId: null,
}

export const useCommentDialogStore = create<State & Actions>((set) => ({
  ...initialState,
  actions: {
    setSelectedComment: (comment) => set({ selectedComment: comment }),
    setAddCommentPostId: (postId) => set({ addCommentPostId: postId }),
    resetState: (keys) => {
      if (!keys) {
        set(initialState)
        return
      }

      keys.forEach((key) => set({ [key]: initialState[key] }))
    },
  },
}))
