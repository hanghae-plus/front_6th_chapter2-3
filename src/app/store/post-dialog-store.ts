import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Post } from "@entities/post"

interface PostDialogState {
  isAddOpen: boolean
  isEditOpen: boolean
  editingPost: Post | null
  openAdd: () => void
  closeAdd: () => void
  openEdit: (post: Post) => void
  closeEdit: () => void
}

export const usePostDialogStore = create<PostDialogState>()(
  devtools((set) => ({
    isAddOpen: false,
    isEditOpen: false,
    editingPost: null,
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: (post) => set({ isEditOpen: true, editingPost: post }),
    closeEdit: () => set({ isEditOpen: false, editingPost: null }),
  })),
)
