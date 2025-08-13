import { useQueryParamsPagination } from "@/shared/hooks"
import { postSchema } from "@/entities/posts"

import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs"

export const usePostListFilterQueryParams = () => {
  const [selectedTag, setSelectedTag] = useQueryState("tag", parseAsString.withDefault(""))
  const [queryParamsPagination, setQueryParamsPagination] = useQueryParamsPagination()
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsStringEnum([postSchema.keyof().enum.id, postSchema.keyof().enum.title, postSchema.keyof().enum.reactions]).withDefault(postSchema.keyof().enum.id))

  return {
    queryParams : { ...queryParamsPagination, selectedTag, sortBy },
    setSelectedTag,
    setQueryParamsPagination,
    setSortBy,
  }
}
