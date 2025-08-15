import { useQuery } from "@tanstack/react-query"

import { fetchPostTags } from "@/entities/post/api/tags"
import { postTagKeys } from "@/entities/post/lib"

export function usePostTagsQuery() {
  return useQuery({
    queryKey: postTagKeys.lists(),
    queryFn: () => fetchPostTags(),
  })
}
