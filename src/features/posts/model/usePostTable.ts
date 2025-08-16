import { useQueryPosts } from "@/features/posts/api/useQueryPosts.ts"
import { usePostRouteParams } from "@/features/posts/model/usePostRouteParams.ts"
import { useSelectedTag } from "@/features/tag/model/useSelectedTag.ts"

export const usePostTable = () => {
  const { searchQuery, skip, limit, sortBy, sortOrder } = usePostRouteParams()
  const { selectedTag } = useSelectedTag()

  return useQueryPosts({
    searchQuery,
    selectedTag,
    limit,
    skip,
    sortBy,
    sortOrder,
  })
}
