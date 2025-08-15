import { Search } from "lucide-react"
import { Input } from "../../shared/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/Select"
import { useGetTags } from "../../entities/post/model/hooks"

interface PostFilterProps {
  searchInputValue: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  onSearchInputChange: (value: string) => void
  onSelectedTagChange: (value: string) => void
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: string) => void
  onSearch: () => void
}

export const PostFilter = ({
  searchInputValue,
  selectedTag,
  sortBy,
  sortOrder,
  onSearchInputChange,
  onSelectedTagChange,
  onSortByChange,
  onSortOrderChange,
  onSearch,
}: PostFilterProps) => {
  const tags = useGetTags()

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchInputValue}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={onSelectedTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.data?.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
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
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
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
