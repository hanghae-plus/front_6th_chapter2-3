import { useQueryTags } from "../entities/Tag/api"
import { atom, useAtom } from "jotai"

const selectedTagAtom = atom<string>("")

export function useTags() {
  const { data: tags = [] } = useQueryTags()
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)

  return {
    tags,
    selectedTag,
    setSelectedTag,
  }
}
