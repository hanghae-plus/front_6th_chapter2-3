import { queryOptions } from "@tanstack/react-query"

import { postApi, FetchPostsBySearchParams, FetchPostsByTagParams, FetchPostsParams } from "./api"

export const postQueries = {
  all: () => ["post"] as const,
  list: () => [...postQueries.all(), "list"] as const,
  listQuery: (params: FetchPostsParams) =>
    queryOptions({
      queryKey: [...postQueries.list(), params],
      queryFn: () => postApi.getPosts(params),
    }),

  listByTag: () => [...postQueries.list(), "byTag"] as const,
  listByTagQuery: (params: FetchPostsByTagParams) =>
    queryOptions({
      queryKey: [...postQueries.listByTag(), params],
      queryFn: () => postApi.getPostsByTag(params.tag),
      enabled: !!params.tag,
    }),

  search: () => [...postQueries.list(), "search"] as const,
  searchQuery: (params: FetchPostsBySearchParams) =>
    queryOptions({
      queryKey: [...postQueries.search(), params],
      queryFn: () => postApi.searchPosts(params.search!),
      enabled: !!params.search,
    }),

  detail: () => [...postQueries.all(), "detail"] as const,
  detailQuery: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.detail(), id],
      queryFn: () => postApi.getPosts({ limit: 1, skip: parseInt(id) - 1 }),
      enabled: !!id,
    }),

  tag: () => [...postQueries.all(), "tag"] as const,
  tagQuery: () =>
    queryOptions({
      queryKey: [...postQueries.all(), "tag"],
      queryFn: postApi.getTags,
    }),
}
