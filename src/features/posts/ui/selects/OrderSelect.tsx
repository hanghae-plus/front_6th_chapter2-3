import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui"

interface OrderSelectProps {
  sortMode: {
    param: {
      order: string
      sortBy: string
    }
    update: (sortBy: string, order: string) => void
  }
}

export default function OrderSelect({ sortMode }: OrderSelectProps) {
  const { param, update } = sortMode
  return (
    <Select value={param.order} onValueChange={(value) => update(param.sortBy, value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 순서" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">오름차순</SelectItem>
        <SelectItem value="desc">내림차순</SelectItem>
      </SelectContent>
    </Select>
  )
}
