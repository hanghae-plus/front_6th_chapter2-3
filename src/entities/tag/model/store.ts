import { create } from "zustand"
import { Tag } from "./types"
import { tagApi } from "../api"

interface TagStore {
  tags: Tag[]
  selectedTag: string
  loading: boolean
  error: string | null

  // 기본 상태 관리
  setTags: (tags: Tag[]) => void
  setSelectedTag: (tag: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  getTags: () => Promise<void>
}

export const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  selectedTag: "",
  loading: false,
  error: null,

  // 기본 상태 관리
  setTags: (tags) => set({ tags }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getTags: async () => {
    const { tags, setTags, setLoading, setError } = get()

    // 이미 태그를 불러왔으면 다시 불러오지 않음
    if (tags.length > 0) return

    setLoading(true)
    setError(null)

    try {
      const fetchedTags = await tagApi.getTags()
      setTags(fetchedTags)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "태그 가져오기 오류"
      setError(errorMessage)
      console.error("태그 가져오기 오류:", err)
      setTags([])
    } finally {
      setLoading(false)
    }
  },
}))
