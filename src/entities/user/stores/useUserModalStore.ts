import { create } from "zustand"

interface UserModalStore {
  selectedUserId: number | null
  isOpenUserModal: boolean
  actions: {
    setSelectedUserId: (userId: number) => void
    setIsOpenUserModal: (isOpen: boolean) => void
  }
}

export const useUserModalStore = create<UserModalStore>((set) => ({
  selectedUserId: null,
  isOpenUserModal: false,
  actions: {
    setSelectedUserId: (userId) => set({ selectedUserId: userId }),
    setIsOpenUserModal: (isOpen) => set({ isOpenUserModal: isOpen }),
  },
}))
