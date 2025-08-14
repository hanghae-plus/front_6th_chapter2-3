import { useListQueryParams } from "@/shared/hooks"
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
  const {
    queryParams,
    onPageChange,
    onLimitChange,
    onSearchQueryChange,
    onOrderChange,
    onSkipChange,
  } = useListQueryParams()

  const [selectedTag, setSelectedTag] = useQueryState(
    "tag",
    parseAsString.withDefault(""),
  )

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

  return {
    queryParams: {
      ...queryParams,
      selectedTag,
      sortBy,
    },
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
