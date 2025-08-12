import { create } from "zustand"
import { User } from "./types"

interface UserStore {
  selectedUser: User | null
  showUserModal: boolean

  setSelectedUser: (user: User | null) => void
  setShowUserModal: (show: boolean) => void
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  showUserModal: false,

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setShowUserModal: (showUserModal) => set({ showUserModal }),
}))
