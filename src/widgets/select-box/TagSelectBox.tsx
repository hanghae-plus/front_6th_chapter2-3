import { useMemo, useState, startTransition } from "react"
import { useSearchParams } from "react-router-dom"
import { useTags } from "@/entities/tag/model"
import { Tag } from "@/entities/tag/model/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const TagSelectBox = () => {
  const [selectedTag, setSelectedTag] = useState("")
  const [, setSearchParams] = useSearchParams()

  // 태그 목록 조회
  const { tags: tagList } = useTags()

  // 태그 렌더링을 useMemo로 최적화
  const tagOptions = useMemo(() => {
    if (!tagList) return []

    return tagList.map((tag: Tag) => (
      <SelectItem key={tag.slug} value={tag.slug}>
        {tag.slug}
      </SelectItem>
    ))
  }, [tagList])

  const handleTagChange = (value: string) => {
    // 즉시 실행되어야 하는 상태 업데이트
    setSelectedTag(value)

    startTransition(() => {
      setSearchParams(
        (prev) => {
          console.log(value)
          prev.set("tag", value)
          return prev
        },
        { replace: true },
      )
    })
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
