import { create } from "zustand"

export const initialMode = { type: "list", limit: 10, skip: 0 } as const

export type FetchPostsMode =
  | { type: "list"; limit: number; skip: number }
  | { type: "search"; q: string }
  | { type: "tag"; tag: string }

export interface FetchPostsModeState {
  mode: FetchPostsMode
}

export interface FetchPostsModeAction {
  setMode: (mode: FetchPostsMode) => void
}

export const useFetchPostsModeStore = create<FetchPostsModeState & FetchPostsModeAction>((set) => ({
  mode: initialMode,
  setMode: (mode) => set({ mode }),
}))
