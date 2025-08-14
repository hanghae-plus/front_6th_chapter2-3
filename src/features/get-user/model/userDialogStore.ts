import { create } from "zustand"

interface State {
  selectedUserId: number | null
}

interface Actions {
  actions: {
    setSelectedUserId: (userId: number | null) => void
    resetState: (keys?: Array<keyof State>) => void
  }
}

const initialState: State = {
  selectedUserId: null,
}

export const useUserDialogStore = create<State & Actions>((set) => ({
  ...initialState,
  actions: {
    setSelectedUserId: (userId) => set({ selectedUserId: userId }),
    resetState: (keys) => {
      if (!keys) {
        set(initialState)
        return
      }

      keys.forEach((key) => set({ [key]: initialState[key] }))
    },
  },
}))
