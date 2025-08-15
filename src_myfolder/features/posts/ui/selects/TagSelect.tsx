import React from "react"
import { Tag } from "../../../entities/post/model"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui"

interface TagSelectProps {
  tagMode: {
    param: string
    update: (value: string) => void
  }
  tags: Tag[]
}

export default function TagSelect({ tagMode, tags }: TagSelectProps) {
  const { param, update } = tagMode

  return (
    <Select
      value={param}
      onValueChange={(value) => {
        update(value)
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
