import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import { updateURL } from "@/shared/lib"

export type State = {
  skip: number
  limit: number
  search: string
  sortBy: string
  sortOrder: string
  tag: string
}

type Actions = {
  actions: {
    updateParam: <K extends keyof State>(key: K, value: State[K]) => void
    updateParams: (updates: Partial<State>) => void
    resetState: (keys?: Array<keyof State>) => void
    initializeFromURL: () => void
  }
}

const initialState: State = {
  skip: 0,
  limit: 10,
  search: "",
  sortBy: "",
  sortOrder: "asc",
  tag: "",
}

export const usePostParamsStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    actions: {
      updateParam: (key, value) => {
        set((state) => ({ ...state, [key]: value }))
        const { skip, limit, search, sortBy, sortOrder, tag } = get()
        updateURL({ skip, limit, search, sortBy, sortOrder, tag })
      },
      updateParams: (updates) => {
        set((state) => ({ ...state, ...updates }))
        const { skip, limit, search, sortBy, sortOrder, tag } = get()
        updateURL({ skip, limit, search, sortBy, sortOrder, tag })
      },
      resetState: (keys) => {
        if (!keys) {
          set(initialState)
          updateURL(initialState)
          return
        }

        keys.forEach((key) => set((state) => ({ ...state, [key]: initialState[key] })))
        const { skip, limit, search, sortBy, sortOrder, tag } = get()
        updateURL({ skip, limit, search, sortBy, sortOrder, tag })
      },
      initializeFromURL: () => {
        if (typeof window === "undefined") return

        const searchParams = new URLSearchParams(window.location.search)
        set({
          skip: parseInt(searchParams.get("skip") || "0"),
          limit: parseInt(searchParams.get("limit") || "10"),
          search: searchParams.get("search") || "",
          sortBy: searchParams.get("sortBy") || "",
          sortOrder: searchParams.get("sortOrder") || "asc",
          tag: searchParams.get("tag") || "",
        })
      },
    },
  })),
)
