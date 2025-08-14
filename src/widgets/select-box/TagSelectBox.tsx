import { useMemo, useState, startTransition, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useTags } from "@/entities/tag/model/useTags"
import { Tag } from "@/entities/tag/model"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const TagSelectBox = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "")

  const { data } = useTags()

  const tagOptions = useMemo(() => {
    const tags = data || []
    return tags.map((tag: Tag) => (
      <SelectItem key={tag.slug} value={tag.slug}>
        {tag.slug}
      </SelectItem>
    ))
  }, [data])

  const handleTagChange = (value: string) => {
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

  useEffect(() => {
    setSelectedTag(searchParams.get("tag") || "")
  }, [searchParams])

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
