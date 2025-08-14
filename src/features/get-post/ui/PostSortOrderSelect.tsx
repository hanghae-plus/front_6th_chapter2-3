import { usePostParamsStore } from "@/features/get-post/model"
import { Select } from "@/shared/ui/Select"

export function PostSortOrderSelect() {
  const sortOrder = usePostParamsStore((state) => state.sortOrder)
  const { updateParam } = usePostParamsStore((state) => state.actions)

  const handleValueChange = (value: string) => {
    updateParam("sortOrder", value)
  }

  return (
    <Select value={sortOrder} onValueChange={handleValueChange}>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="정렬 순서" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="asc">오름차순</Select.Item>
        <Select.Item value="desc">내림차순</Select.Item>
      </Select.Content>
    </Select>
  )
}
