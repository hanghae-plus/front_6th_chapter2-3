import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"

interface SortBySelectProps {
  sortMode: {
    param: {
      sortBy: string
      order: string
    }
    update: (sortBy: string, order: string) => void
  }
}

export default function SortBySelect({ sortMode }: SortBySelectProps) {
  const { param, update } = sortMode
  return (
    <Select value={param.sortBy} onValueChange={(value) => update(value, param.order)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 기준" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">없음</SelectItem>
        <SelectItem value="id">ID</SelectItem>
        <SelectItem value="title">제목</SelectItem>
        <SelectItem value="reactions">반응</SelectItem>
      </SelectContent>
    </Select>
  )
}
