import { create } from "zustand"
import type { Post, PostFormData } from "../types"

// 게시물 상태 인터페이스
interface PostState {
  // 선택된 게시물
  selectedPost: Post | null

  // 새 게시물 폼 데이터
  newPost: PostFormData

  // 게시물 필터 상태
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string

  // 액션들
  setSelectedPost: (post: Post | null) => void
  setNewPost: (post: PostFormData) => void
  updateNewPost: (updates: Partial<PostFormData>) => void
  resetNewPost: () => void

  // 필터 액션들
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: string) => void
  resetFilters: () => void
}

// 초기 새 게시물 데이터
const initialNewPost: PostFormData = {
  title: "",
  body: "",
  userId: 1,
}

// 게시물 스토어 생성
export const usePostStore = create<PostState>((set) => ({
  // 초기 상태
  selectedPost: null,
  newPost: initialNewPost,
  searchQuery: "",
  selectedTag: "",
  sortBy: "",
  sortOrder: "asc",

  // 액션들
  setSelectedPost: (post) => set({ selectedPost: post }),

  setNewPost: (post) => set({ newPost: post }),

  updateNewPost: (updates) =>
    set((state) => ({
      newPost: { ...state.newPost, ...updates },
    })),

  resetNewPost: () => set({ newPost: initialNewPost }),

  // 필터 액션들
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedTag: "",
      sortBy: "",
      sortOrder: "asc",
    }),
}))
