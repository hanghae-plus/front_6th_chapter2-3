import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { getPostsRequestParamsSchema, postEntityQueries, postSchema } from "@/entities/posts"
import { usePostListFilterQueryParams } from "@/widgets/post-list-table"

import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"

export const PostListTableFilter = () => {
  const postListFilter = usePostListFilterQueryParams()

  const { data: tags } = useQuery({
    ...postEntityQueries.getPostTags(),
  })

  const handleChangeSearchQuery = (searchQuery: string) => {
    postListFilter.onSearchQueryChange(searchQuery)
  }

  const handleChangeSortBy = (sortBy: string) => {
    const parsedSortBy = getPostsRequestParamsSchema.shape.sortBy.safeParse(sortBy)
    if (!parsedSortBy.success) return

    postListFilter.onSortByChange(parsedSortBy.data ?? "id")
  }

  const handleChangeOrder = (order: string) => {
    const parsedOrder = getPostsRequestParamsSchema.shape.order.safeParse(order)
    if (!parsedOrder.success) return

    postListFilter.onOrderChange(parsedOrder.data ?? "asc")
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
            value={postListFilter.queryParams.searchQuery}
            onChange={(event) => handleChangeSearchQuery(event.target.value)}
          />
        </div>
      </div>
      <Select
        value={postListFilter.queryParams.selectedTag}
        onValueChange={(value) => postListFilter.onTagChange(value)}
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
      <Select name="sortBy" value={postListFilter.queryParams.sortBy} onValueChange={(value) => handleChangeSortBy(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value={postSchema.keyof().enum.id}>ID</SelectItem>
          <SelectItem value={postSchema.keyof().enum.title}>제목</SelectItem>
          <SelectItem value={postSchema.keyof().enum.reactions}>반응</SelectItem>
        </SelectContent>
      </Select>
      <Select
        name="order"
        value={postListFilter.queryParams.order}
        onValueChange={(value) => handleChangeOrder(value)}
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
