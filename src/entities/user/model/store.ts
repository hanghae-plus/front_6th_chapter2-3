import { create } from "zustand"
import { User } from "./types"
import { userApi } from "../api/userApi"

interface UsersState {
  selectedUser: User | null
  loading: boolean
  error: string | null

  // Actions
  fetchUser: (id: number) => Promise<void>
  setSelectedUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  selectedUser: null,
  loading: false,
  error: null,

  fetchUser: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const userData = await userApi.getUser(id)
      set({ selectedUser: userData, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("사용자 정보 가져오기 오류:", error)
    }
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}))
