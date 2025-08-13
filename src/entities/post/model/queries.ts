import { queryOptions } from "@tanstack/react-query"
import { postApi } from "@/entities/post/api"
import type { PostFilter } from "@/shared/types"
import { POST_QK } from "./query-key"

export const postQueries = {
  // 키만 쓰고 싶을 때를 위해 keys는 분리 유지
  keys: POST_QK,

  list: (filters: PostFilter = {}) =>
    queryOptions({
      queryKey: POST_QK.list(filters),
      queryFn: () => postApi.list(filters),
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      select: (res) => ({ posts: res.posts, total: res.total }),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: POST_QK.detail(id),
      queryFn: () => postApi.detail(id),
      staleTime: 10 * 60 * 1000, // 10분
      gcTime: 15 * 60 * 1000, // 15분
      enabled: !!id,
    }),

  tags: () =>
    queryOptions({
      queryKey: POST_QK.tags(),
      queryFn: () => postApi.tags(),
      staleTime: 5 * 60 * 1000, // 5분
    }),
}
