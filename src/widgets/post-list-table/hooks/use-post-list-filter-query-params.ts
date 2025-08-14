import { useQueryParamsPagination } from "@/shared/hooks"
import { postSchema } from "@/entities/posts"

import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs"

const SORTABLE_FIELDS = [
  postSchema.keyof().enum.id,
  postSchema.keyof().enum.title,
  postSchema.keyof().enum.reactions,
] as const

type SortableField = typeof SORTABLE_FIELDS[number]

const DEFAULT_SORT_FIELD: SortableField = postSchema.keyof().enum.id

export const usePostListFilterQueryParams = () => {
  const [selectedTag, setSelectedTag] = useQueryState(
    "tag",
    parseAsString.withDefault(""),
  )

  const [queryParamsPagination, setQueryParamsPagination] = useQueryParamsPagination()

  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsStringEnum([...SORTABLE_FIELDS]).withDefault(DEFAULT_SORT_FIELD),
  )

  // 개별 onChange 함수들
  const onTagChange = (tag: string) => {
    setSelectedTag(tag || null)
  }

  const onSortByChange = (field: SortableField) => {
    setSortBy(field)
  }

  const onPageChange = (page: number) => {
    const skip = (page - 1) * queryParamsPagination.limit
    setQueryParamsPagination({ skip })
  }

  const onLimitChange = (limit: number) => {
    setQueryParamsPagination({ limit, skip: 0 })
  }

  const onSearchQueryChange = (searchQuery: string) => {
    setQueryParamsPagination({ searchQuery: searchQuery || null, skip: 0 })
  }

  const onOrderChange = (order: "asc" | "desc") => {
    setQueryParamsPagination({ order })
  }

  const onSkipChange = (skip: number) => {
    setQueryParamsPagination({ skip })
  }

  return {
    queryParams: {
      ...queryParamsPagination,
      selectedTag,
      sortBy,
    },
    // 원본 setter 함수들
    setSelectedTag,
    setQueryParamsPagination,
    setSortBy,
    // 개별 onChange 함수들
    onTagChange,
    onSortByChange,
    onPageChange,
    onLimitChange,
    onSearchQueryChange,
    onOrderChange,
    onSkipChange,
  }
}
