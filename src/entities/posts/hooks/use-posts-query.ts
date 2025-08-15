import { postEntityQueries } from "../api"
import type { getPostsBySlugRequestParamsSchema } from "../model"

import { useQuery } from "@tanstack/react-query"
import type { z } from "zod"

type PostsQueryParams = z.infer<typeof getPostsBySlugRequestParamsSchema> & {
  searchQuery?: string
}

export const usePostsQuery = (queryParams: PostsQueryParams) => {
  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ ...queryParams }),
  })

  const postsByTagQuery = useQuery({
    ...postEntityQueries.getPostsBySlug({
      ...queryParams,
      slug: queryParams.slug as string,
    }),
    enabled: !!queryParams.slug,
  })

  const posts = queryParams.slug ? postsByTagQuery.data : postsQuery.data
  const isLoading = queryParams.slug ? postsByTagQuery.isLoading : postsQuery.isLoading
  const error = queryParams.slug ? postsByTagQuery.error : postsQuery.error
  const isFetched = queryParams.slug ? postsByTagQuery.isFetched : postsQuery.isFetched

  return {
    posts,
    isLoading,
    error,
    isFetched,
    postsQuery,
    postsByTagQuery,
  }
}
