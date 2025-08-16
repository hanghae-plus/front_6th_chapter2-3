import { useQuery } from "@tanstack/react-query"

import { getComments } from "."

export const useCommentListQuery = (postId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled,
  })
}