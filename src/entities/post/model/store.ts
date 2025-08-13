import { create } from "zustand"
import { Post, CreatePostRequest, UpdatePost } from "./types"
import { postApi } from "../api"
import { userApi } from "../../user/api/userApi"

interface PostsState {
  posts: Post[]
  total: number
  loading: boolean
  error: string | null
  skip: number
  limit: number

  // Actions
  fetchPosts: (skip: number, limit: number) => Promise<void>
  addPost: (post: CreatePostRequest) => Promise<void>
  updatePost: (id: number, post: UpdatePost) => Promise<void>
  deletePost: (id: number) => Promise<void>
  searchPosts: (query: string) => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
}

export const usePostStore = create<PostsState>((set, get) => ({
  posts: [],
  total: 0,
  loading: false,
  error: null,
  skip: 0,
  limit: 10,

  setPosts: (posts: Post[]) => set({ posts }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setSkip: (skip: number) => set({ skip }),
  setLimit: (limit: number) => set({ limit }),

  addPost: async (post: CreatePostRequest) => {
    try {
      const data = await postApi.addPost(post)
      const { posts } = get()
      set({ posts: [data, ...posts] })
    } catch (error: any) {
      set({ error: error.message })
      console.error("게시물 추가 오류:", error)
    }
  },

  updatePost: async (id: number, post: UpdatePost) => {
    try {
      const data = await postApi.updatePost(id, post)
      const { posts } = get()
      set({
        posts: posts.map((p) => (p.id === data.id ? data : p)),
      })
    } catch (error: any) {
      set({ error: error.message })
      console.error("게시물 업데이트 오류:", error)
    }
  },

  deletePost: async (id: number) => {
    try {
      await postApi.deletePost(id)
      const { posts } = get()
      set({ posts: posts.filter((post) => post.id !== id) })
    } catch (error: any) {
      set({ error: error.message })
      console.error("게시물 삭제 오류:", error)
    }
  },

  fetchPosts: async (skip: number, limit: number) => {
    set({ loading: true, error: null })
    try {
      let postsData
      let usersData

      const postsResponse = await postApi.getPosts(limit, skip)
      postsData = postsResponse

      const usersResponse = await userApi.getUsersList()
      usersData = usersResponse

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      set({ posts: postsWithUsers, total: postsData.total, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("게시물 가져오기 오류:", error)
    }
  },

  searchPosts: async (query: string) => {
    if (!query) {
      const { skip, limit } = get()
      get().fetchPosts(skip, limit)
      return
    }

    set({ loading: true, error: null })
    try {
      const data = await postApi.searchPosts(query)
      set({ posts: data.posts, total: data.total, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("게시물 검색 오류:", error)
    }
  },

  fetchPostsByTag: async (tag: string) => {
    if (!tag || tag === "all") {
      const { skip, limit } = get()
      get().fetchPosts(skip, limit)
      return
    }

    set({ loading: true, error: null })
    try {
      const [postsData, usersData] = await Promise.all([postApi.getPostsByTag(tag), userApi.getUsersList()])

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      set({ posts: postsWithUsers, total: postsData.total, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("태그별 게시물 가져오기 오류:", error)
    }
  },
}))
