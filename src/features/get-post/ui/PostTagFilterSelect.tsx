import type { PostTag } from "@/entities/post/model"
import { usePostParamsStore } from "@/features/get-post/model"
import { Select } from "@/shared/ui/Select"

type PostTagFilterSelectProps = {
  tags: PostTag[]
  onTagChange: (tag: string) => void
}

export function PostTagFilterSelect({ tags, onTagChange }: PostTagFilterSelectProps) {
  const selectedTag = usePostParamsStore((state) => state.tag)
  const { updateParam } = usePostParamsStore((state) => state.actions)

  const handleValueChange = (value: string) => {
    updateParam("tag", value)
    onTagChange(value)
  }

  return (
    <Select value={selectedTag} onValueChange={handleValueChange}>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="태그 선택" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="all">모든 태그</Select.Item>
        {tags.map((tag) => (
          <Select.Item key={tag.url} value={tag.slug}>
            {tag.slug}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
