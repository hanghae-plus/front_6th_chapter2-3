import { useQuery } from "@tanstack/react-query"

import { fetchPostsBySearch } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { FetchPostsSearch } from "@/entities/post/model"

export function usePostsSearchQuery(payload: FetchPostsSearch.Payload) {
  return useQuery({
    queryKey: postKeys.search(payload),
    queryFn: () => fetchPostsBySearch(payload),
    enabled: !!payload.query?.trim(),
  })
}
