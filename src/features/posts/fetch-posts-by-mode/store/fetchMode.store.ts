import { create } from "zustand"

const initialState: FetchPostsQueryParams = {
  mode: "list",
  limit: 10,
  skip: 0,
  sortBy: "id",
  order: "asc",
  tag: "",
  q: "",
}
export type ModeType = "list" | "search" | "tag"

export interface FetchPostsQueryParams {
  mode: ModeType
  limit?: number
  skip?: number
  sortBy?: string
  order?: string
  tag?: string
  q?: string
}

export interface FetchPostsModeAction {
  setMode: (newMode: FetchPostsQueryParams) => void
}

export const useFetchPostsModeStore = create<{
  state: FetchPostsQueryParams
  action: FetchPostsModeAction
}>((set, get) => ({
  state: initialState,
  action: {
    setMode: (newMode) => set({ state: { ...get().state, ...newMode } }),
  },
}))
