import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { postQueries } from "@/entities/post/model/queries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

interface TagSelectBoxProps {
  selectedTag: string
  onTagChange: (value: string) => void
}

export const TagSelectBox = ({ selectedTag, onTagChange }: TagSelectBoxProps) => {
  const queryClient = useQueryClient()
  const [, setSearchParams] = useSearchParams()

  // 태그 목록 조회
  const tagsQuery = useQuery(postQueries.tags())

  // 태그 렌더링을 useMemo로 최적화
  const tagOptions = useMemo(() => {
    return tagsQuery.data?.map((tag) => (
      <SelectItem key={tag.name} value={tag.name}>
        {tag.name}
      </SelectItem>
    ))
  }, [tagsQuery.data])

  const handleTagChange = (value: string) => {
    // URL 파라미터 업데이트
    setSearchParams((prev) => {
      prev.set("tag", value)
      return prev
    })

    // 태그가 변경되면 관련된 posts 쿼리들 제거
    if (value === "all") {
      // 모든 태그일 때는 모든 posts 쿼리 제거
      queryClient.removeQueries({ queryKey: ["posts"] })
    } else {
      // 특정 태그일 때는 해당 태그가 포함된 쿼리들만 제거
      queryClient.removeQueries({
        queryKey: ["posts"],
        predicate: (query) => {
          return query.queryKey.some((key) => typeof key === "object" && key.tag && key.tag !== value)
        },
      })
    }

    // 부모 컴포넌트의 onTagChange 호출
    onTagChange(value)
  }

  return (
    <Select value={selectedTag} onValueChange={handleTagChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tagOptions}
      </SelectContent>
    </Select>
  )
}
