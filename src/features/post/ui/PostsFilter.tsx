import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import React from "react"
import { Tag } from "../../../entities/tag/model/types.ts"

interface PostsFilterProps {
  searchQuery: string
  onChangeSearchQuery: (query: string) => void
  onSearchPosts: () => void
  selectedTag: string
  sortBy: string
  onChangeSortBy: (sortBy: string) => void
  sortOrder: string
  onChangeSortOrder: (sortOrder: string) => void
  tags: Tag[]
  onChangeTag: (value: string) => void
}

export const PostsFilter: React.FC<PostsFilterProps> = ({
  searchQuery,
  onChangeSearchQuery,
  onSearchPosts,
  selectedTag,
  sortBy,
  onChangeSortBy,
  sortOrder,
  onChangeSortOrder,
  tags,
  onChangeTag,
  }) => {

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearchPosts()}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={onChangeTag}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onChangeSortBy}>
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
      <Select value={sortOrder} onValueChange={onChangeSortOrder}>
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