import { create } from "zustand"
import { User } from "./types"
import { userApi } from "../api"

interface UserState {
  selectedUser: User | null
  loading: boolean
  error: string | null

  fetchUser: (id: number) => Promise<void>

  setSelectedUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  loading: false,
  error: null,

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUser: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const data = await userApi.getUser(id)
      set({ selectedUser: data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("사용자 정보 가져오기 오류:", error)
    }
  },
}))
