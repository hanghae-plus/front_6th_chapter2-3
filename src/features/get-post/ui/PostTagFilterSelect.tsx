/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "@/shared/ui/Select"

interface PostTagFilterSelectProps {
  selectedTag: string
  tags: any[]
  onTagChange: (tag: string) => void
}

export function PostTagFilterSelect({ selectedTag, tags, onTagChange }: PostTagFilterSelectProps) {
  return (
    <Select value={selectedTag} onValueChange={onTagChange}>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="태그 선택" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="all">모든 태그</Select.Item>
        {tags.map((tag: any) => (
          <Select.Item key={tag.url} value={tag.slug}>
            {tag.slug}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
