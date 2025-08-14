import { queryOptions } from "@tanstack/react-query"
import { POST_QK } from "@/entities/post/model/query-key"
import { getPosts } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { HttpClient } from "@/shared/api/http"
import type { PostFilter, UserPaginatedResponse, Post, User, Author } from "@/shared/types"
import { normalize } from "@/shared/lib/normalizeParams"

// 게시물 + 작성자 join 쿼리
export const postWithAuthorQueries = {
  list: (filters: PostFilter = {}) =>
    queryOptions({
      // 조합 쿼리는 'withAuthor' 같은 꼬리표로 차별화
      queryKey: [...POST_QK.list(filters), "withAuthor", normalize({})],
      queryFn: async () => {
        const [base, users] = await Promise.all([
          getPosts(filters),
          HttpClient.get<UserPaginatedResponse>(`/users?limit=0&select=username,image`),
        ])

        const map = new Map(users.users.map((u: User) => [u.id, u]))
        const posts = base.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) as Author }))

        return { posts, total: base.total }
      },
      staleTime: 30_000, // 30초
      gcTime: 10 * 60 * 1000, // 10분
      placeholderData: (previousData) => previousData,
    }),

  listByTag: (tag: string, filters: PostFilter = {}) =>
    queryOptions({
      queryKey: [...POST_QK.list(filters), "byTag", tag, "withAuthor", normalize({})],
      queryFn: async () => {
        console.log("여기 들어옴")

        if (!tag || tag === "all") {
          // 기본 목록 쿼리와 동일한 로직
          const [base, users] = await Promise.all([getPosts(filters), getUsers()])

          const map = new Map(users.users.map((u: User) => [u.id, u]))
          const posts = base.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) }))

          console.log(posts)

          return { posts, total: base.total }
        }

        const [postsResponse, usersResponse] = await Promise.all([getPosts({ ...filters, tag }), getUsers()])

        const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
        const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) }))

        return { posts, total: postsResponse.total }
      },
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
    }),

  search: (query: string, filters: PostFilter = {}) =>
    queryOptions({
      queryKey: [...POST_QK.list(filters), "search", query, "withAuthor", normalize({})],
      queryFn: async () => {
        if (!query) {
          // 검색어가 없으면 기본 목록 쿼리와 동일한 로직
          const [base, users] = await Promise.all([getPosts(filters), getUsers()])

          const map = new Map(users.users.map((u: User) => [u.id, u]))
          const posts = base.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) }))

          return { posts, total: base.total }
        }

        const [postsResponse, usersResponse] = await Promise.all([getPosts({ ...filters, q: query }), getUsers()])

        const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
        const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) }))

        return { posts, total: postsResponse.total }
      },
      staleTime: 2 * 60 * 1000, // 2분
      enabled: query.length > 0,
    }),
}
