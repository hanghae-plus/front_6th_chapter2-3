import { create } from "zustand"

import type { Post } from "@/entities/post/model"

interface State {
  selectedPost: Post | null
  newPost: {
    title: string
    body: string
    userId: number
  }
}

interface Actions {
  actions: {
    setSelectedPost: (post: Post | null) => void
    setNewPost: (post: Partial<State["newPost"]>) => void
    resetNewPost: () => void
    resetState: (keys?: Array<keyof State>) => void
  }
}

const initialState: State = {
  selectedPost: null,
  newPost: {
    title: "",
    body: "",
    userId: 1,
  },
}

export const usePostDialogStore = create<State & Actions>((set) => ({
  ...initialState,
  actions: {
    setSelectedPost: (post) => set({ selectedPost: post }),
    setNewPost: (post) => set((state) => ({ newPost: { ...state.newPost, ...post } })),
    resetNewPost: () => set({ newPost: initialState.newPost }),
    resetState: (keys) => {
      if (!keys) {
        set(initialState)
        return
      }

      keys.forEach((key) => set({ [key]: initialState[key] }))
    },
  },
}))
