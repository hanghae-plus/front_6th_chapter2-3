import { useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const SortSelectBox = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortByChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("sortBy", value)
      return prev
    })

    // 정렬 기준이 변경되면 관련된 쿼리들만 제거
    if (value === "none") {
      // 정렬 없음일 때는 모든 posts 쿼리 제거
      queryClient.removeQueries({ queryKey: ["posts"] })
    } else {
      // 특정 정렬 기준일 때는 해당 정렬 기준이 포함된 쿼리들만 제거
      queryClient.removeQueries({
        queryKey: ["posts"],
        predicate: (query) => {
          // queryKey에 정렬 기준이 포함된 쿼리만 제거
          return query.queryKey.some((key) => {
            if (typeof key === "object" && key && "sortBy" in key) {
              const sortKey = key as { sortBy?: string }
              return sortKey.sortBy && sortKey.sortBy !== value
            }
            return false
          })
        },
      })
    }
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
