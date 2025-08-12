import { create } from "zustand"
import { Tag } from "./types"

interface TagStore {
  tags: Tag[]
  selectedTag: string

  setTags: (tags: Tag[]) => void
  setSelectedTag: (tag: string) => void
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  selectedTag: "",

  setTags: (tags) => set({ tags }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
}))
