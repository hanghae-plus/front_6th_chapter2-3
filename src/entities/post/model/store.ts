import { create } from "zustand"
import { Post, CreatePostRequest, UpdatePost } from "./types"
import { postApi } from "../api"
import { userApi } from "../../user/api"

interface PostsState {
  posts: Post[]
  total: number
  loading: boolean
  error: string | null
  selectedPost: Post | null

  skip: number
  limit: number

  fetchPosts: (skip: number, limit: number) => Promise<void>
  searchPosts: (query: string) => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  createPost: (post: CreatePostRequest) => Promise<void>
  editPost: (id: number, post: UpdatePost) => Promise<void>
  deletePost: (id: number) => Promise<void>

  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedPost: (post: Post | null) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
}

export const usePostStore = create<PostsState>((set, get) => ({
  posts: [],
  total: 0,
  loading: false,
  error: null,
  selectedPost: null,
  skip: 0,
  limit: 10,

  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),

  fetchPosts: async (skip: number, limit: number) => {
    set({ loading: true, error: null })
    try {
      const [postsData, usersData] = await Promise.all([postApi.getPosts(limit, skip), userApi.getUsersList()])

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      set({
        posts: postsWithUsers,
        total: postsData.total,
        loading: false,
        skip,
        limit,
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("게시물 가져오기 오류:", error)
    }
  },

  searchPosts: async (query: string) => {
    if (!query.trim()) {
      const { skip, limit } = get()
      get().fetchPosts(skip, limit)
      return
    }

    set({ loading: true, error: null })
    try {
      const [data, usersData] = await Promise.all([postApi.searchPosts(query), userApi.getUsersList()])

      const postsWithUsers = data.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      set({
        posts: postsWithUsers,
        total: data.total,
        loading: false,
        skip: 0, // 검색 시 첫 페이지로
      })
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

      set({
        posts: postsWithUsers,
        total: postsData.total,
        loading: false,
        skip: 0, // 태그 필터 시 첫 페이지로
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("태그별 게시물 가져오기 오류:", error)
    }
  },

  createPost: async (post: CreatePostRequest) => {
    try {
      const data = await postApi.addPost(post)
      const { posts } = get()
      set({ posts: [data, ...posts] })
    } catch (error: any) {
      set({ error: error.message })
      console.error("게시물 추가 오류:", error)
    }
  },

  editPost: async (id: number, post: UpdatePost) => {
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
}))
