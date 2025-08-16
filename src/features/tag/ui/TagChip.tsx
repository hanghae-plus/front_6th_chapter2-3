import { useSelectedTag } from "@/features/tag/model/useSelectedTag.ts"
import { Key } from "react"

export function TagChip({ tag }: { key: Key; tag: string }) {
  const { selectedTag, setSelectedTag } = useSelectedTag()

  function handleTagSelect() {
    setSelectedTag(tag)
  }

  return (
    <span
      key={tag}
      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
        selectedTag === tag ? "text-white bg-blue-500 hover:bg-blue-600" : "text-blue-800 bg-blue-100 hover:bg-blue-200"
      }`}
      onClick={handleTagSelect}
    >
      {tag}
    </span>
  )
}
