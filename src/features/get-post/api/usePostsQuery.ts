import { useQuery } from "@tanstack/react-query"

import { fetchPosts } from "@/entities/post/api/posts"
import { postKeys } from "@/entities/post/lib"
import type { FetchPosts } from "@/entities/post/model"

export function usePostsQuery(payload: FetchPosts.Payload = {}) {
  return useQuery({
    queryKey: postKeys.list(payload),
    queryFn: () => fetchPosts(payload),
  })
}
