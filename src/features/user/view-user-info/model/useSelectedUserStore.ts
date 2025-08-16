import { create } from "zustand"

interface SelectedUserStore {
  selectedUserId: number | null
  setSelectedUserId: (userId: number) => void
}

export const useSelectedUserStore = create<SelectedUserStore>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
}))
