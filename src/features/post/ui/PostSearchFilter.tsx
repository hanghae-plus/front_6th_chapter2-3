import { Search } from "lucide-react"
import { Tags } from "../../../entities"
import { Input, Select } from "../../../shared"

export const PostSearchFilter = ({
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  tags,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  handleChangeTag,
  handleSearchPost,
}: {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  tags: Tags
  setSearchQuery: (setSearchQuery: string) => void
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  handleChangeTag: (value: string) => void
  handleSearchPost: (e: React.KeyboardEvent<HTMLInputElement>) => void
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchPost}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        placeholder="태그 선택"
        triggerProps={{ className: "w-[180px]" }}
        onValueChange={handleChangeTag}
        options={[{ name: "모든 태그", value: "all" }, ...tags.map((tag) => ({ name: tag.slug, value: tag.slug }))]}
      />
      <Select
        value={sortBy}
        onValueChange={setSortBy}
        placeholder="정렬 기준"
        triggerProps={{ className: "w-[180px]" }}
        options={[
          { name: "없음", value: "none" },
          { name: "ID", value: "id" },
          { name: "제목", value: "title" },
          { name: "반응", value: "reactions" },
        ]}
      />
      <Select
        value={sortOrder}
        onValueChange={setSortOrder}
        placeholder="정렬 순서"
        triggerProps={{ className: "w-[180px]" }}
        options={[
          { name: "오름차순", value: "asc" },
          { name: "내림차순", value: "desc" },
        ]}
      />
    </div>
  )
}
