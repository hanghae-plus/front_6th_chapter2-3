import { useQuery } from "@tanstack/react-query"

import { fetchPosts } from "@/entities/post/api/posts"
import type { FetchPosts } from "@/entities/post/model"

export function usePostsQuery(payload: FetchPosts.Payload = {}) {
  return useQuery({
    queryKey: ["posts", payload],
    queryFn: () => fetchPosts(payload),
  })
}
