import React from "react"
import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui"
import { Tag, useGetTags } from "@entities/post"
import { usePostQueryParams } from "@shared/hooks/use-post-query-params"

export const PostFilters: React.FC = () => {
  const { param, updateUrl } = usePostQueryParams()
  const { data: tags = [] } = useGetTags()

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={param.search || ""}
            onChange={(e) => updateUrl({ search: e.target.value, skip: 0 })}
          />
        </div>
      </div>

      <Select value={param.tag || "all"} onValueChange={(value) => updateUrl({ tag: value, skip: 0 })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag: Tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={param.sortBy || "none"} onValueChange={(value) => updateUrl({ sortBy: value, skip: 0 })}>
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

      <Select
        value={param.sortOrder || "asc"}
        onValueChange={(value) => updateUrl({ sortOrder: value as "asc" | "desc", skip: 0 })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
