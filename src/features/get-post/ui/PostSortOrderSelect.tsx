import { Select } from "@/shared/ui/Select"

interface PostSortOrderSelectProps {
  sortOrder: string
  onSortOrderChange: (sortOrder: string) => void
}

export function PostSortOrderSelect({ sortOrder, onSortOrderChange }: PostSortOrderSelectProps) {
  return (
    <Select value={sortOrder} onValueChange={onSortOrderChange}>
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
