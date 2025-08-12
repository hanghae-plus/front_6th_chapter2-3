import { create } from "zustand"
import { Post } from "./types"

interface PostStore {
  posts: Post[]
  total: number
  loading: boolean
  selectedPost: Post | null

  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  setSelectedPost: (post: Post | null) => void
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  removePost: (id: number) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  total: 0,
  loading: false,
  selectedPost: null,

  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    })),
  removePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
}))
