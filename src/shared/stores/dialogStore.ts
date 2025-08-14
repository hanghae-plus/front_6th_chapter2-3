import { create } from "zustand"

interface DialogState {
  showAddDialog: boolean
  showEditDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showPostDetailDialog: boolean
  showUserModal: boolean

  // 다이얼로그 열기
  openAddDialog: () => void
  openEditDialog: () => void
  openAddCommentDialog: () => void
  openEditCommentDialog: () => void
  openPostDetailDialog: () => void
  openUserModal: () => void

  // 다이얼로그 닫기
  closeAddDialog: () => void
  closeEditDialog: () => void
  closeAddCommentDialog: () => void
  closeEditCommentDialog: () => void
  closePostDetailDialog: () => void
  closeUserModal: () => void

  // 모든 다이얼로그 닫기
  closeAllDialogs: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,

  openAddDialog: () => set({ showAddDialog: true }),
  openEditDialog: () => set({ showEditDialog: true }),
  openAddCommentDialog: () => set({ showAddCommentDialog: true }),
  openEditCommentDialog: () => set({ showEditCommentDialog: true }),
  openPostDetailDialog: () => set({ showPostDetailDialog: true }),
  openUserModal: () => set({ showUserModal: true }),

  closeAddDialog: () => set({ showAddDialog: false }),
  closeEditDialog: () => set({ showEditDialog: false }),
  closeAddCommentDialog: () => set({ showAddCommentDialog: false }),
  closeEditCommentDialog: () => set({ showEditCommentDialog: false }),
  closePostDetailDialog: () => set({ showPostDetailDialog: false }),
  closeUserModal: () => set({ showUserModal: false }),

  closeAllDialogs: () =>
    set({
      showAddDialog: false,
      showEditDialog: false,
      showAddCommentDialog: false,
      showEditCommentDialog: false,
      showPostDetailDialog: false,
      showUserModal: false,
    }),
}))
