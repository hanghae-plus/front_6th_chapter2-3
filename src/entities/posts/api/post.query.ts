import { createEntityQueries } from "@/shared/lib"

import { getPosts, getPostsBySlug, getPostTags } from "./post.api"

const factory = createEntityQueries("post")

const getPostsQuery = factory.build("getPosts", getPosts)
const getPostsBySlugQuery = factory.build("getPostsBySlug", getPostsBySlug)
const getPostTagsQuery = factory.buildParamless<Awaited<ReturnType<typeof getPostTags>>>("getPostTags", getPostTags)

export const postEntityQueries = {
  all: factory.all,
  getPostsKey: getPostsQuery.getKey,
  getPosts: getPostsQuery.getOptions,
  getPostsBySlugKey: getPostsBySlugQuery.getKey,
  getPostsBySlug: getPostsBySlugQuery.getOptions,
  getPostTagsKey: getPostTagsQuery.getKey,
  getPostTags: getPostTagsQuery.getOptions,
}
