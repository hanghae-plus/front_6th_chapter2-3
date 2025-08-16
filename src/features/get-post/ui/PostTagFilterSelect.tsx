import { Select } from "@/base/ui/Select"
import { usePostParamsStore } from "@/features/get-post/model"
import { usePostTagsQuery } from "@/features/get-post-tags/api"

export function PostTagFilterSelect() {
  const selectedTag = usePostParamsStore((state) => state.tag)
  const { updateParam } = usePostParamsStore((state) => state.actions)
  const { data: tags } = usePostTagsQuery()

  const handleValueChange = (value: string) => {
    updateParam("tag", value)
  }

  return (
    <Select value={selectedTag} onValueChange={handleValueChange}>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="태그 선택" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="all">모든 태그</Select.Item>
        {tags?.map((tag) => (
          <Select.Item key={tag.url} value={tag.slug}>
            {tag.slug}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
