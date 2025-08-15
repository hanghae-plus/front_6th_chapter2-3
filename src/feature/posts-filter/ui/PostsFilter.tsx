import { Search } from "lucide-react"
import { useEffect, useState } from "react"

import { PostQueryParams } from "@/entities/post"
import { Tag } from "@/entities/tag"
import { useGetTags } from "@/feature/get-tags"
import { usePostsQuery } from "@/feature/post-query/model/usePostsQuery"
import { DEBOUNCE_DELAY_TIME } from "@/shared"
import { useDebounceValue } from "@/shared/hooks/useDebounceValue"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

export const PostsFilter = () => {
  const { current, updateQuery } = usePostsQuery()
  const { data: tagsData } = useGetTags()

  const [inputValue, setInputValue] = useState(current.search || "")
  const debouncedSearchQuery = useDebounceValue(inputValue, DEBOUNCE_DELAY_TIME)

  useEffect(() => {
    updateQuery({ search: debouncedSearchQuery })
  }, [debouncedSearchQuery, updateQuery])

  useEffect(() => {
    setInputValue(current.search || "")
  }, [current.search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateQuery({ search: inputValue })
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="게시물 검색"
            className="pl-8"
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            placeholder="게시물 검색..."
            value={inputValue}
          />
        </div>
      </div>

      {/* 태그 필터 */}
      <Select onValueChange={(value) => updateQuery({ tag: value })} value={current.tag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tagsData?.map((tag: Tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 정렬 기준 */}
      <Select
        onValueChange={(value: string) => updateQuery({ sortBy: value as PostQueryParams["sortBy"] })}
        value={current.sortBy}
      >
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

      {/* 정렬 순서 */}
      <Select
        onValueChange={(value) => updateQuery({ order: value as PostQueryParams["order"] })}
        value={current.order}
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
