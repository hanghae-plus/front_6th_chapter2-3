import { Select } from "@/shared/ui/Select"

interface PostSortBySelectProps {
  sortBy: string
  onSortByChange: (sortBy: string) => void
}

export function PostSortBySelect({ sortBy, onSortByChange }: PostSortBySelectProps) {
  return (
    <Select value={sortBy} onValueChange={onSortByChange}>
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="정렬 기준" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="none">없음</Select.Item>
        <Select.Item value="id">ID</Select.Item>
        <Select.Item value="title">제목</Select.Item>
        <Select.Item value="reactions">반응</Select.Item>
      </Select.Content>
    </Select>
  )
}
