import { atom, useAtom } from "jotai"

const selectedTagAtom = atom("")

export const useSelectedTag = () => {
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)

  return new (class {
    selectedTag = selectedTag
    setSelectedTag = setSelectedTag
  })()
}
