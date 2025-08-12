import type { getPostsRequestParamsSchema } from "../model"
import { getPosts, getPostsBySlug, getPostTags } from "./post.api"

import { queryOptions } from "@tanstack/react-query"
import type z from "zod"

export const postEntityQueries = {
  all: ["post"] as const,

  getPostsKey: (requestParams: z.infer<typeof getPostsRequestParamsSchema>) =>
    [...postEntityQueries.all, "getPosts", requestParams] as const,
  getPosts: (requestParams: z.infer<typeof getPostsRequestParamsSchema>) =>
    queryOptions({
      queryKey: postEntityQueries.getPostsKey(requestParams),
      queryFn: () => getPosts(requestParams),
    }),

  getPostsBySlugKey: (slug: string) => [...postEntityQueries.all, "getPostsBySlug", slug] as const,
  getPostsBySlug: (slug: string) =>
    queryOptions({
      queryKey: postEntityQueries.getPostsBySlugKey(slug),
      queryFn: () => getPostsBySlug(slug),
    }),

  getPostTagsKey: () => [...postEntityQueries.all, "getPostTags"] as const,
  getPostTags: () =>
    queryOptions({
      queryKey: postEntityQueries.getPostTagsKey(),
      queryFn: () => getPostTags(),
    }),
}
