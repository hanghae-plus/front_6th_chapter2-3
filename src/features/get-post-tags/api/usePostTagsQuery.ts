import { useQuery } from "@tanstack/react-query"

import { fetchPostTags } from "@/entities/post/api/tags"

export function usePostTagsQuery() {
  return useQuery({
    queryKey: ["posts", "tags"],
    queryFn: () => fetchPostTags(),
  })
}
