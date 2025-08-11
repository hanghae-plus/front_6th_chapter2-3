import { tagSchema } from "@/entities/posts"
import { useQueryParamsPagination } from "@/shared/hooks"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

import { Search } from "lucide-react"
import { z } from "zod"

type Props = {
  selectedTag: string
  setSelectedTag: (tag: string) => void
  tags: z.infer<typeof tagSchema>[]
}

export const PostListTableFilter = ({ selectedTag, setSelectedTag, tags }: Props) => {
  const [queryParamsPagination, setQueryParamsPagination] = useQueryParamsPagination()
  return (
    <form
      className="flex gap-4"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={queryParamsPagination.searchQuery}
            onChange={(e) =>
              setQueryParamsPagination((prevPagination) => ({ ...prevPagination, searchQuery: e.target.value }))
            }
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(value) => {
          setSelectedTag(value)
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
      <Select
        value={queryParamsPagination.sortBy}
        onValueChange={(value) => setQueryParamsPagination((prevPagination) => ({ ...prevPagination, sortBy: value }))}
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
      <Select
        value={queryParamsPagination.sortOrder}
        onValueChange={(value) =>
          setQueryParamsPagination((prevPagination) => ({ ...prevPagination, sortOrder: value }))
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </form>
  )
}
