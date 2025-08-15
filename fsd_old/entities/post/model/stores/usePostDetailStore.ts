import { Post } from "@entities/post"
import { create } from "zustand"

interface PostDetailStore {
  selectedPost: Post | null
  isOpenPostDetail: boolean
  actions: {
    setSelectedPost: (post: Post) => void
    setIsOpenPostDetail: (isOpen: boolean) => void
  }
}

export const usePostDetailStore = create<PostDetailStore>((set) => ({
  selectedPost: null,
  isOpenPostDetail: false,
  actions: {
    setSelectedPost: (post) => set({ selectedPost: post }),
    setIsOpenPostDetail: (isOpen) => set({ isOpenPostDetail: isOpen }),
  },
}))
