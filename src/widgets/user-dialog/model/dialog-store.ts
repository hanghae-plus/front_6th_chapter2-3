import { create } from "zustand"

interface UserDialogState {
  // User Dialog
  isUserDialogOpen: boolean
  userIdForDialog: number | null
  openUserDialog: (userId: number) => void
  closeUserDialog: () => void
}

export const useUserDialogStore = create<UserDialogState>((set) => ({
  // User Dialog
  isUserDialogOpen: false,
  userIdForDialog: null,
  openUserDialog: (userId) => set({ isUserDialogOpen: true, userIdForDialog: userId }),
  closeUserDialog: () => set({ isUserDialogOpen: false, userIdForDialog: null }),
}))