import { Select } from "@/base/ui/Select"
import { usePostParamsStore } from "@/features/get-post/model"

export function PostSortBySelect() {
  const sortBy = usePostParamsStore((state) => state.sortBy)
  const { updateParam } = usePostParamsStore((state) => state.actions)

  const handleValueChange = (value: string) => {
    updateParam("sortBy", value)
  }

  return (
    <Select value={sortBy} onValueChange={handleValueChange}>
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
