import { POSTS_QUERY_KEY } from "@entities/post/const"
import { Post } from "@entities/post/types"
import { http } from "@shared/lib/api/http"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

interface GetPostsRequestParams {
  skip?: number
  limit?: number
  select?: keyof Post
  sortBy?: string
  order?: string
}

export interface GetPostsResponse {
  limit: number
  skip: number
  total: number
  posts: Post[]
}

const getPosts = async (params: GetPostsRequestParams) => {
  const { skip, limit, select, sortBy, order } = params

  const response = await http.get<GetPostsResponse>("/posts", {
    params: {
      skip,
      limit,
      select,
      sortBy,
      order,
    },
  })

  return response
}

export const useGetPosts = (
  params: GetPostsRequestParams,
  options?: Omit<UseQueryOptions<GetPostsResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<GetPostsResponse>({
    queryKey: POSTS_QUERY_KEY.list([params]),
    queryFn: () => getPosts(params),
    ...options,
  })
}
