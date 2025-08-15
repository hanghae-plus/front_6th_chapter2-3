import { COMMENT_QUERY_KEY } from "@entities/comment/const"
import { Comment } from "@entities/comment/types"
import { http } from "@shared/lib/api/http"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

export interface GetCommentResponse {
  total: number
  skip: number
  limit: number
  comments: Comment[]
}

const getComment = async (postId: number) => {
  const response = await http.get<GetCommentResponse>(`/comments/post/${postId}`)

  return response
}

export const useGetComment = (
  postId: number,
  options?: Omit<UseQueryOptions<GetCommentResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEY.detail([postId]),
    queryFn: () => getComment(postId),
    ...options,
  })
}
