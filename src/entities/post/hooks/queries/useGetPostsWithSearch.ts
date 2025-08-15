import { POSTS_QUERY_KEY } from "@entities/post/const"
import { Post } from "@entities/post/types"
import { http } from "@shared/lib/api/http"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

interface GetPostsWithSearchResponse {
  limit: number
  skip: number
  total: number
  posts: Post[]
}

const getPostsWithSearch = async (searchQuery: string) => {
  const response = await http.get<GetPostsWithSearchResponse>("/posts/search", {
    params: {
      q: searchQuery,
    },
  })

  return response
}

export const useGetPostsWithSearch = (
  searchQuery: string,
  options?: Omit<UseQueryOptions<GetPostsWithSearchResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<GetPostsWithSearchResponse>({
    queryKey: POSTS_QUERY_KEY.list([{ search: searchQuery }]),
    queryFn: () => getPostsWithSearch(searchQuery),
    ...options,
  })
}
