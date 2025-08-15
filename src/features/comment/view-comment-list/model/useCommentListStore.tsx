import React from "react"
import { createStore, useStore } from "zustand"
import type { CommentItem } from "@entities/comment/model"

interface CommentListState {
  actions: {
    onAddComment: () => void
    onEditComment: (comment: CommentItem) => void
    onDeleteComment: (id: number) => void
    onLikeComment: (id: number) => void
  }
}

type CommentListStore = ReturnType<typeof createCommentListStore>

const createCommentListStore = (
  addComment: () => void,
  editComment: (comment: CommentItem) => void,
  deleteComment: (id: number) => void,
  likeComment: (id: number) => void,
) => {
  return createStore<CommentListState>(() => ({
    actions: {
      onAddComment: () => {
        addComment()
      },

      onEditComment: (comment: CommentItem) => {
        editComment(comment)
      },

      onDeleteComment: (id: number) => {
        deleteComment(id)
      },

      onLikeComment: (id: number) => {
        likeComment(id)
      },
    },
  }))
}

const CommentListStoreContext = React.createContext<CommentListStore | null>(null)

interface CommentListProviderProps {
  children: React.ReactNode
  addComment: () => void
  editComment: (comment: CommentItem) => void
  deleteComment: (id: number) => void
  likeComment: (id: number) => void
}

export const CommentListProvider = ({
  children,
  addComment,
  editComment,
  deleteComment,
  likeComment,
}: CommentListProviderProps) => {
  const [store] = React.useState(() => createCommentListStore(addComment, editComment, deleteComment, likeComment))

  return <CommentListStoreContext.Provider value={store}>{children}</CommentListStoreContext.Provider>
}

const useCommentListStore = <T,>(selector: (state: CommentListState) => T): T => {
  const store = React.useContext(CommentListStoreContext)
  if (!store) {
    throw new Error("useCommentListStore must be used within CommentListProvider")
  }
  return useStore(store, selector)
}

export const useCommentListActions = () => useCommentListStore((state) => state.actions)

export { useCommentListStore }
