import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/Select"
import { useTagStore } from "../model/store"
import { useFilter } from "../../../features/filterPosts/model/useFilter"

const TagFilter: FC = () => {
  const { tags, selectedTag } = useTagStore()
  const { fetchTags, handleTagChange } = useFilter()

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return (
    <Select value={selectedTag} onValueChange={handleTagChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TagFilter
