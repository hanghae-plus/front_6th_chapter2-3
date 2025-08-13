import { create } from "zustand"
import { Comment, CreateCommentRequest, UpdateComment } from "./types"
import { commentApi } from "../api"

interface CommentsState {
  comments: Record<number, Comment[]>
  loading: boolean
  error: string | null

  fetchComments: (postId: number) => Promise<void>
  addComment: (comment: CreateCommentRequest) => Promise<void>
  updateComment: (id: number, comment: UpdateComment) => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
  likeComment: (id: number, postId: number) => Promise<void>
  setComments: (postId: number, comments: Comment[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCommentStore = create<CommentsState>((set, get) => ({
  comments: {},
  loading: false,
  error: null,

  setComments: (postId: number, comments: Comment[]) =>
    set((prev) => ({
      comments: { ...prev.comments, [postId]: comments },
    })),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  fetchComments: async (postId: number) => {
    if (get().comments[postId]) return

    set({ loading: true, error: null })
    try {
      const data = await commentApi.getComments(postId)
      set((prev) => ({
        comments: { ...prev.comments, [postId]: data.comments },
        loading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("댓글 가져오기 오류:", error)
    }
  },

  addComment: async (comment: CreateCommentRequest) => {
    try {
      const data = await commentApi.addComment(comment)
      set((prev) => ({
        comments: {
          ...prev.comments,
          [data.postId]: [...(prev.comments[data.postId] || []), data],
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 추가 오류:", error)
    }
  },

  updateComment: async (id: number, comment: UpdateComment) => {
    try {
      const data = await commentApi.updateComment(id, comment)
      set((prev) => ({
        comments: {
          ...prev.comments,
          [data.postId]: prev.comments[data.postId].map((c) => (c.id === data.id ? data : c)),
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 수정 오류:", error)
    }
  },

  deleteComment: async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id)
      set((prev) => ({
        comments: {
          ...prev.comments,
          [postId]: prev.comments[postId].filter((c) => c.id !== id),
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 삭제 오류:", error)
    }
  },

  likeComment: async (id: number, postId: number) => {
    try {
      const currentComments = get().comments[postId]
      const comment = currentComments.find((c) => c.id === id)
      if (!comment) return

      const data = await commentApi.likeComment(id)
      set((prev) => ({
        comments: {
          ...prev.comments,
          [postId]: prev.comments[postId].map((c) => (c.id === data.id ? { ...data, likes: c.likes + 1 } : c)),
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 좋아요 오류:", error)
    }
  },
}))
