import { create } from 'zustand'

interface User {
  id: number
  username: string
  image: string
  [key: string]: unknown
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: { likes: number; dislikes: number }
  author?: User
  [key: string]: unknown
}

interface Comment {
  id: number
  postId: number
  body: string
  likes: number
  user: User
  [key: string]: unknown
}

interface PostsState {
  loading: boolean
  posts: Post[]
  total: number
  skip: number
  limit: number
  tags: { slug: string; url: string }[]
  selectedTag: string
  searchQuery: string
  comments: Record<number, Comment[]>
  /* State setters */
  setPagination: (skip: number, limit: number) => void
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string) => void
  /* Async actions */
  fetchPosts: () => Promise<void>
  fetchTags: () => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  searchPosts: () => Promise<void>
  addPost: (post: Omit<Post, 'id'>) => Promise<Post | undefined>
  updatePost: (post: Post) => Promise<void>
  deletePost: (id: number) => Promise<void>
  fetchComments: (postId: number) => Promise<void>
  addComment: (comment: Omit<Comment, 'id'>) => Promise<Comment | undefined>
  updateComment: (comment: Comment) => Promise<void>
  deleteComment: (id: number, postId: number) => Promise<void>
  likeComment: (id: number, postId: number) => Promise<void>
}

export const usePostsStore = create<PostsState>((set, get) => ({
  /* base state */
  loading: false,
  posts: [],
  total: 0,
  skip: 0,
  limit: 10,
  tags: [],
  selectedTag: '',
  searchQuery: '',
  comments: {},

  /* setters */
  setPagination: (skip, limit) => set({ skip, limit }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),

  /* actions */
  fetchPosts: async () => {
    const { limit, skip } = get()
    set({ loading: true })
    try {
      const postsResp = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      const postsData = await postsResp.json()
      const usersResp = await fetch('/api/users?limit=0&select=username,image')
      const usersData = await usersResp.json()
      const enriched = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((u: User) => u.id === post.userId),
      }))
      set({ posts: enriched, total: postsData.total })
    } catch (e) {
      console.error('fetchPosts error', e)
    } finally {
      set({ loading: false })
    }
  },

  fetchTags: async () => {
    try {
      const resp = await fetch('/api/posts/tags')
      const data = await resp.json()
      set({ tags: data })
    } catch (e) {
      console.error('fetchTags error', e)
    }
  },

  fetchPostsByTag: async (tag) => {
    if (!tag || tag === 'all') {
      await get().fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const [postsResp, usersResp] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch('/api/users?limit=0&select=username,image'),
      ])
      const postsData = await postsResp.json()
      const usersData = await usersResp.json()
      const enriched = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((u: User) => u.id === post.userId),
      }))
      set({ posts: enriched, total: postsData.total })
    } catch (e) {
      console.error('fetchPostsByTag error', e)
    } finally {
      set({ loading: false })
    }
  },

  searchPosts: async () => {
    const { searchQuery } = get()
    if (!searchQuery) {
      await get().fetchPosts()
      return
    }
    set({ loading: true })
    try {
      const resp = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await resp.json()
      set({ posts: data.posts, total: data.total })
    } catch (e) {
      console.error('searchPosts error', e)
    } finally {
      set({ loading: false })
    }
  },

  addPost: async (post) => {
    try {
      const resp = await fetch('/api/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data: Post = await resp.json()
      set((state) => ({ posts: [data, ...state.posts] }))
      return data
    } catch (e) {
      console.error('addPost error', e)
    }
  },

  updatePost: async (post) => {
    try {
      const resp = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data: Post = await resp.json()
      set((state) => ({ posts: state.posts.map((p) => (p.id === data.id ? data : p)) }))
    } catch (e) {
      console.error('updatePost error', e)
    }
  },

  deletePost: async (id) => {
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }))
    } catch (e) {
      console.error('deletePost error', e)
    }
  },

  fetchComments: async (postId) => {
    const { comments } = get()
    if (comments[postId]) return
    try {
      const resp = await fetch(`/api/comments/post/${postId}`)
      const data = await resp.json()
      set((state) => ({ comments: { ...state.comments, [postId]: data.comments } }))
    } catch (e) {
      console.error('fetchComments error', e)
    }
  },

  addComment: async (comment) => {
    try {
      const resp = await fetch('/api/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      })
      const data: Comment = await resp.json()
      set((state) => ({
        comments: {
          ...state.comments,
          [data.postId]: [...(state.comments[data.postId] || []), data],
        },
      }))
      return data
    } catch (e) {
      console.error('addComment error', e)
    }
  },

  updateComment: async (comment) => {
    try {
      const resp = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: comment.body }),
      })
      const data: Comment = await resp.json()
      set((state) => ({
        comments: {
          ...state.comments,
          [data.postId]: state.comments[data.postId].map((c) => (c.id === data.id ? data : c)),
        },
      }))
    } catch (e) {
      console.error('updateComment error', e)
    }
  },

  deleteComment: async (id, postId) => {
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].filter((c) => c.id !== id),
        },
      }))
    } catch (e) {
      console.error('deleteComment error', e)
    }
  },

  likeComment: async (id, postId) => {
    const { comments } = get()
    const target = comments[postId]?.find((c) => c.id === id)
    if (!target) return
    try {
      const resp = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: target.likes + 1 }),
      })
      const data: Comment = await resp.json()
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].map((c) => (c.id === data.id ? { ...data, likes: c.likes + 1 } : c)),
        },
      }))
    } catch (e) {
      console.error('likeComment error', e)
    }
  },
}))
