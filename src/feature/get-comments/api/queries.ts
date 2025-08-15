import { useQuery } from "@tanstack/react-query"

import { commentApi } from "@/entities/comment"

export const useGetComments = (postId?: number) => {
  return useQuery({
    enabled: !!postId,
    queryFn: () => commentApi.getByPostId(postId!),
    queryKey: ["comments", postId],
  })
}
