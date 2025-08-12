import { create } from "zustand"
import { Comment } from "./types"

interface CommentStore {
  comments: Record<number, Comment[]>
  selectedComment: Comment | null

  setComments: (postId: number, comments: Comment[]) => void
  addComment: (comment: Comment) => void
  updateComment: (comment: Comment) => void
  removeComment: (id: number, postId: number) => void
  likeComment: (id: number, postId: number) => void
  setSelectedComment: (comment: Comment | null) => void
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: {},
  selectedComment: null,

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),

  addComment: (comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: [...(state.comments[comment.postId] || []), comment],
      },
    })),

  updateComment: (updatedComment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [updatedComment.postId]:
          state.comments[updatedComment.postId]?.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment,
          ) || [],
      },
    })),

  removeComment: (id, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId]?.filter((comment) => comment.id !== id) || [],
      },
    })),

  likeComment: (id, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]:
          state.comments[postId]?.map((comment) =>
            comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
          ) || [],
      },
    })),

  setSelectedComment: (selectedComment) => set({ selectedComment }),
}))
