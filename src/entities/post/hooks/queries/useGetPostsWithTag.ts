import { POSTS_QUERY_KEY } from "@entities/post/const"
import { Post } from "@entities/post/types"
import { http } from "@shared/lib/api/http"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

interface GetPostsWithTagResponse {
  limit: number
  skip: number
  total: number
  posts: Post[]
}

const getPostsWithTag = async (tag: string) => {
  const response = await http.get<GetPostsWithTagResponse>(`/posts/tag/${tag}`)

  return response
}

export const useGetPostsWithTag = (
  tag: string,
  options?: Omit<UseQueryOptions<GetPostsWithTagResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<GetPostsWithTagResponse>({
    queryKey: POSTS_QUERY_KEY.list([{ tag }]),
    queryFn: () => getPostsWithTag(tag),
    ...options,
  })
}
