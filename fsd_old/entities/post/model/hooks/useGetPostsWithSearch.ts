import { POSTS_QUERY_KEY } from "@entities/post/model/keys"
import { Post } from "@entities/post/model/types"
import { http } from "@shared/api"
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
