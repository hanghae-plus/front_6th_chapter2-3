import { useQuery } from "@tanstack/react-query"

import { tagsApi } from "@/entities/post/api/tagApi"
import { queryKeys } from "@/entities/post/lib/queryKeys"

export const useGetTags = () => {
  return useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: tagsApi.getTags,
  })
}
