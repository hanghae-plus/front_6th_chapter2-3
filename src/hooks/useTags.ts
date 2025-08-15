import { atom, useAtom } from "jotai"
import { Tag } from "../entities/Tag/Tag"

const tagsAtom = atom<Tag[]>([])
const selectedTagAtom = atom<string>("")

export function useTags() {
  const [tags, setTags] = useAtom(tagsAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)

  // 태그 가져오기
  async function fetchTags() {
    try {
      const response = await fetch("/api/posts/tags")
      const data = (await response.json()) as Tag[]
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  return {
    tags,
    setTags,
    fetchTags,
    selectedTag,
    setSelectedTag,
  }
}
