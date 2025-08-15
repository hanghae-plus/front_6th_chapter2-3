import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "./index"

export const useGetComments = (postId: number | null) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId as number),
    enabled: postId != null,
  })
}

// mutations moved to ./mutations
