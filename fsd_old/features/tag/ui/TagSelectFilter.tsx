import { useGetTags } from "@entities/tag"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select"
import { useSearchParams } from "react-router-dom"

export const TagSelectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: tags } = useGetTags()

  const handleTagChange = (tag: string) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      if (tag === "all") {
        updated.delete("tag")
      } else {
        updated.set("tag", tag)
      }

      return updated
    })
  }

  return (
    <Select
      value={searchParams.get("tag") || "all"}
      onValueChange={(value) => {
        handleTagChange(value)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags?.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
