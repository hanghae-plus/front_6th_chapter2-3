import { create } from "zustand"
import { Comment, CreateCommentRequest, UpdateComment } from "./types"
import { commentApi } from "../api"

interface CommentsState {
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  loading: boolean
  error: string | null

  fetchComments: (postId: number) => Promise<void>
  createComment: (comment: CreateCommentRequest) => Promise<void>
  editComment: (id: number, comment: UpdateComment) => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
  likeComment: (id: number, postId: number) => Promise<void>

  setComments: (postId: number, comments: Comment[]) => void
  setSelectedComment: (comment: Comment | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCommentStore = create<CommentsState>((set, get) => ({
  comments: {},
  selectedComment: null,
  loading: false,
  error: null,

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchComments: async (postId: number) => {
    set({ loading: true, error: null })
    try {
      const data = await commentApi.getCommentsByPost(postId)
      set((state) => ({
        comments: { ...state.comments, [postId]: data.comments },
        loading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("댓글 가져오기 오류:", error)
    }
  },

  createComment: async (comment: CreateCommentRequest) => {
    try {
      const data = await commentApi.addComment(comment)
      const { comments } = get()
      const postComments = comments[comment.postId!] || []
      set((state) => ({
        comments: {
          ...state.comments,
          [comment.postId!]: [data, ...postComments],
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 추가 오류:", error)
    }
  },

  editComment: async (id: number, comment: UpdateComment) => {
    try {
      const data = await commentApi.updateComment(id, comment)
      const { comments } = get()
      const updatedComments = Object.keys(comments).reduce(
        (acc, postId) => {
          acc[Number(postId)] = comments[Number(postId)].map((c) => (c.id === data.id ? data : c))
          return acc
        },
        {} as Record<number, Comment[]>,
      )
      set({ comments: updatedComments })
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 업데이트 오류:", error)
    }
  },

  deleteComment: async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id)
      const { comments } = get()
      const postComments = comments[postId] || []
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: postComments.filter((comment) => comment.id !== id),
        },
      }))
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 삭제 오류:", error)
    }
  },

  likeComment: async (id: number, postId: number) => {
    try {
      const data = await commentApi.likeComment(id)
      const { comments } = get()
      const updatedComments = Object.keys(comments).reduce(
        (acc, postId) => {
          acc[Number(postId)] = comments[Number(postId)].map((c) => (c.id === data.id ? data : c))
          return acc
        },
        {} as Record<number, Comment[]>,
      )
      set({ comments: updatedComments })
    } catch (error: any) {
      set({ error: error.message })
      console.error("댓글 좋아요 오류:", error)
    }
  },
}))
