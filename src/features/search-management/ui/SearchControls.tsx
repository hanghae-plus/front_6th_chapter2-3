import { Search } from "lucide-react"

import { PostSearchParams } from "@/entities/post/model"
import { Input } from "@/shared/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

interface SearchControlsProps {
  onKeyPressDown: (e: React.KeyboardEvent) => void
  onSearchInputChange: (value: string) => void
  onSearchSubmit: () => void
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: string) => void
  onTagChange: (value: string) => void
  searchCondition: PostSearchParams
  searchInput: string
  tags: Array<{ slug: string; url: string }> | undefined
}

export function SearchControls({
  searchInput,
  searchCondition,
  tags,
  onSearchInputChange,
  onKeyPressDown,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
}: SearchControlsProps) {
  return (
    <div className="flex gap-4">
      {/* 검색 입력 */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyPress={onKeyPressDown}
            placeholder="게시물 검색... (엔터로 검색)"
            value={searchInput}
          />
        </div>
      </div>

      {/* 태그 선택 */}
      <Select disabled={!!searchCondition.search} onValueChange={onTagChange} value={searchCondition.tag}>
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

      {/* 정렬 기준 */}
      <Select
        disabled={!!searchCondition.search || searchCondition.tag !== "all"}
        onValueChange={onSortByChange}
        value={searchCondition.sortBy || "none"}
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
        disabled={
          !!searchCondition.search ||
          searchCondition.tag !== "all" ||
          !searchCondition.sortBy ||
          searchCondition.sortBy === "none"
        }
        onValueChange={onSortOrderChange}
        value={searchCondition.order}
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
