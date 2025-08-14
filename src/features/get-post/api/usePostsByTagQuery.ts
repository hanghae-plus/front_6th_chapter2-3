import type { UseQueryOptions } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"

import { fetchPostsByTag } from "@/entities/post/api/posts"
import type { FetchPostsByTag } from "@/entities/post/model"

export function usePostsByTagQuery(
  payload: FetchPostsByTag.Payload,
  options: Omit<UseQueryOptions<FetchPostsByTag.Response>, "queryKey" | "queryFn"> = {},
) {
  return useQuery({
    queryKey: ["posts", "tag", payload],
    queryFn: () => fetchPostsByTag(payload),
    enabled: !!payload.tag,
    ...options,
  })
}
