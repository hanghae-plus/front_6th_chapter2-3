import { useQuery } from "@tanstack/react-query"
import { fetchCommentsApi } from "../../../entities/comments/api"

export const useComments = (postId: number | null | undefined) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsApi(postId!),
    enabled: !!postId,
  })
}
