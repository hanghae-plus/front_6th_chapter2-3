import { create } from "zustand"
import { Tag } from "./types"
import { tagApi } from "../api"

interface TagsState {
  tags: Tag[]
  selectedTag: string
  loading: boolean
  error: string | null

  fetchTags: () => Promise<void>

  setTags: (tags: Tag[]) => void
  setSelectedTag: (tag: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTagStore = create<TagsState>((set) => ({
  tags: [],
  selectedTag: "",
  loading: false,
  error: null,

  setTags: (tags) => set({ tags }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchTags: async () => {
    set({ loading: true, error: null })
    try {
      const data = await tagApi.getTags()
      set({ tags: data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      console.error("태그 가져오기 오류:", error)
    }
  },
}))
