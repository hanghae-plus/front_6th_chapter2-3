import { queryOptions } from "@tanstack/react-query"
import { POST_QK } from "./query-key"
import { getPosts, getPost } from "../api"
import { PostOptions } from "./types"

export const postQueries = {
  keys: POST_QK,

  list: (filters: PostOptions = {}) =>
    queryOptions({
      queryKey: POST_QK.list(filters),
      queryFn: () => getPosts(filters),
      select: (res) => ({ posts: res.posts, total: res.total }),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: POST_QK.detail(id),
      queryFn: () => getPost(id),
      enabled: !!id,
    }),
}
