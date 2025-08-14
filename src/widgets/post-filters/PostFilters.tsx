import { Search } from "lucide-react"
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import type { Tag } from "../../shared/lib/types"

interface PostFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: () => void
  selectedTag: string
  setSelectedTag: (tag: string) => void
  tags: Tag[]
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: string
  setSortOrder: (order: string) => void
}

export const PostFilters = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  selectedTag,
  setSelectedTag,
  tags,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: PostFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>
      <Button onClick={handleSearch} size="sm">
        검색
      </Button>
      <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value === "all" ? "" : value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.slug} value={tag.slug}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-full sm:w-[180px]">
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
