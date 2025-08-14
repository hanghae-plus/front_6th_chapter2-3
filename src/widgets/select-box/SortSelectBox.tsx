import { useSearchParams } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const SortSelectBox = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortByChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("sortBy", value)
      return prev
    })
  }

  return (
    <Select value={searchParams.get("sortBy") || ""} onValueChange={(value: string) => handleSortByChange(value)}>
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
