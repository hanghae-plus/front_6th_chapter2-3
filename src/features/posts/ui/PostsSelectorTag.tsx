import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { useQueryTags } from "@/features/tag/api/useQueryTags.ts"
import { useSelectedTag } from "@/features/tag/model/useSelectedTag.ts"

export function PostsSelectorTag() {
  const { data: tags } = useQueryTags()
  const { selectedTag, setSelectedTag } = useSelectedTag()

  return (
    <Select value={selectedTag} onValueChange={setSelectedTag}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags?.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
