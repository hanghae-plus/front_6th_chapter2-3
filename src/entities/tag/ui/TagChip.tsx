import { useFilter } from "../../../features.tsx/filterPosts/model/useFilter"
import { useTagStore } from "../model/store"
import { FC } from "react"

interface TagChipProps {
  tag: string
}

const TagChip: FC<TagChipProps> = ({ tag }) => {
  const { selectedTag } = useTagStore()
  const { handleTagChange } = useFilter()

  const isSelected = selectedTag === tag

  return (
    <span
      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
        isSelected ? "text-white bg-blue-500 hover:bg-blue-600" : "text-blue-800 bg-blue-100 hover:bg-blue-200"
      }`}
      onClick={() => handleTagChange(tag)}
    >
      {tag}
    </span>
  )
}

export default TagChip
