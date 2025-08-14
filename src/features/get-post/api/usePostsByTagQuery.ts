import { useQuery } from "@tanstack/react-query"

import { fetchPostsByTag } from "@/entities/post/api/posts"
import type { FetchPostsByTag } from "@/entities/post/model"

export function usePostsByTagQuery(payload: FetchPostsByTag.Payload) {
  return useQuery({
    queryKey: ["posts", "tag", payload],
    queryFn: () => fetchPostsByTag(payload),
    enabled: !!payload.tag,
  })
}
