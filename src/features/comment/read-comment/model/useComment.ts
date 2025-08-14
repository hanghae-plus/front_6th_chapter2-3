import { useQuery, queryOptions } from "@tanstack/react-query"
import { commentKeys } from "@/entities/comment/model/query-key"
import { getComment } from "@/entities/comment/api"

export const useComment = (commentId: number) => {
  return useQuery(
    queryOptions({
      queryKey: commentKeys.detail(commentId),
      queryFn: () => getComment(commentId),
      enabled: commentId !== null && commentId > 0,
    }),
  )
}
