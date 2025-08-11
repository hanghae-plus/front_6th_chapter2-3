import { postEntityQueries } from "@/entities/posts"
import { useQueryParamsPagination } from "@/shared/hooks"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { useQuery } from "@tanstack/react-query"

import { Search } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

export const PostListTableFilter = () => {
  const [selectedTag, setSelectedTag] = useQueryState("tag", parseAsString.withDefault(""))
  const [queryParamsPagination, setQueryParamsPagination] = useQueryParamsPagination()

  const { data: tags } = useQuery({
    ...postEntityQueries.getPostTags(),
  })

  const handleChangeSearchQuery = (searchQuery: string) => {
    setQueryParamsPagination((prevPagination) => ({ ...prevPagination, searchQuery }))
  }

  const handleChangeSortBy = (sortBy: string) => {
    setQueryParamsPagination((prevPagination) => ({ ...prevPagination, sortBy }))
  }

  const handleChangeSortOrder = (sortOrder: string) => {
    setQueryParamsPagination((prevPagination) => ({ ...prevPagination, sortOrder }))
  }

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
            name="searchQuery"
            placeholder="게시물 검색..."
            className="pl-8"
            value={queryParamsPagination.searchQuery}
            onChange={(event) => handleChangeSearchQuery(event.target.value)}
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
      <Select name="sortBy" value={queryParamsPagination.sortBy} onValueChange={(value) => handleChangeSortBy(value)}>
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
        name="sortOrder"
        value={queryParamsPagination.sortOrder}
        onValueChange={(value) => handleChangeSortOrder(value)}
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
