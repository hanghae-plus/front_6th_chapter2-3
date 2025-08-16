import { useQuery2 } from "../../../shared/createQuery.ts"
import { PostResponse } from "../Post.ts"

const placeholderData = { posts: [], total: 0 }

export const useQueryPosts = (limit: number, skip: number) =>
  useQuery2<PostResponse>(["/api/posts", { limit, skip }], {
    placeholderData,
    enabled: true,
  })

export const useQueryPostsByTag = (tag: string, limit: number, skip: number) =>
  useQuery2<PostResponse>(["/api/posts/tag", tag, { limit, skip }], {
    placeholderData,
    enabled: !!tag,
  })

export const useQueryPostsBySearch = (q: string) =>
  useQuery2<PostResponse>(["/api/posts/search", { q }], {
    placeholderData,
    enabled: !!q,
  })
