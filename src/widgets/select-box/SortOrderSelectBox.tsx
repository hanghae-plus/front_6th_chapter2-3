import { useSearchParams } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const SortOrderSelectBox = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortOrderChange = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("sortOrder", value)
      return newParams
    })
  }

  return (
    <Select
      value={searchParams.get("sortOrder") || "asc"}
      onValueChange={(value: string) => handleSortOrderChange(value)}
    >
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
