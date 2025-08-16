import { create } from "zustand"

interface SelectedPostStore {
  selectedPostId: number | null
  setSelectedPostId: (postId: number) => void
}

export const useSelectedPostStore = create<SelectedPostStore>((set) => ({
  selectedPostId: null,
  setSelectedPostId: (postId) => set({ selectedPostId: postId }),
}))
