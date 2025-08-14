import { Plus, Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "../../../../shared/ui"
import type { PostsBrowseParams } from ".."
import type { Tag } from "../../../../entities/post/model"
import type { ChangeEvent } from "react"
import { SortOrder } from "../../../../shared/config/sort"

interface PostsFilterBarProps {
  tags?: Tag[]
  onAddPost?: () => void
  params: PostsBrowseParams
  onChange: (next: Partial<PostsBrowseParams>) => void
}

export const PostsFilterBar = ({ tags, onAddPost, params, onChange }: PostsFilterBarProps) => {
  const { searchQuery, tag: selectedTag, sortBy, order } = params

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ searchQuery: e.target.value })}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter"}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(value: string) => {
          onChange({ tag: value })
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
      <Select value={sortBy} onValueChange={(value: string) => onChange({ sortBy: value })}>
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
      <Select value={order} onValueChange={(value: string) => onChange({ order: value as SortOrder })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SortOrder.ASC}>오름차순</SelectItem>
          <SelectItem value={SortOrder.DESC}>내림차순</SelectItem>
        </SelectContent>
      </Select>
      {onAddPost && (
        <Button onClick={onAddPost}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      )}
    </div>
  )
}
