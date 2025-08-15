import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/select"
import { useSearchParams } from "react-router-dom"

export const SortBySelect = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortByChange = (sortBy: string) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      if (sortBy === "none") {
        updated.delete("sortBy")
      } else {
        updated.set("sortBy", sortBy)
      }

      return updated
    })
  }

  return (
    <Select value={searchParams.get("sortBy") || "none"} onValueChange={handleSortByChange}>
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
