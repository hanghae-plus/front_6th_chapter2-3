import { queryOptions } from "@tanstack/react-query"
import type { PostFilter } from "@/shared/types"
import { POST_QK } from "./query-key"
import { getPosts, getPost } from "../api"

export const postQueries = {
  keys: POST_QK,

  list: (filters: PostFilter = {}) =>
    queryOptions({
      queryKey: POST_QK.list(filters),
      queryFn: () => getPosts(filters),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      select: (res) => ({ posts: res.posts, total: res.total }),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: POST_QK.detail(id),
      queryFn: () => getPost(id),
      staleTime: 10 * 60 * 1000, // 10분
      gcTime: 15 * 60 * 1000, // 15분
      enabled: !!id,
    }),
}
