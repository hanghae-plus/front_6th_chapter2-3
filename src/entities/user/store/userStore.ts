import { create } from "zustand"

import { User } from "../model/types"

interface UserState {
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}))
