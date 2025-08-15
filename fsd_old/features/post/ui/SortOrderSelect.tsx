import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select"
import { useSearchParams } from "react-router-dom"

export const SortOrderSelect = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortOrderChange = (sortOrder: string) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      updated.set("sortOrder", sortOrder)
      return updated
    })
  }

  return (
    <Select value={searchParams.get("sortOrder") || "asc"} onValueChange={handleSortOrderChange}>
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
