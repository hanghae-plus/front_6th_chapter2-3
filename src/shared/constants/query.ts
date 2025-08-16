import { QueryClient } from "@tanstack/react-query"

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

export const QUERY_KEYS = {
  // 단순 조회
  getTags: () => ["getTags"] as const,

  // user
  getUsers: () => ["getUsers"] as const,
  getUser: (id: number) => ["getUser", id] as const,

  // Post
  getPosts: (limit: number, skip: number, sortBy: string, order: string) =>
    ["getPosts", { limit, skip, sortBy, order }] as const,
  getSeachPosts: (searchQuery: string) => ["getSeachPosts", { searchQuery }] as const,
  getPostsByTag: (tag: string) => ["getPostsByTag", "tag", tag] as const,

  // 코멘트
  getComments: (postId: number) => ["getComments", postId] as const,
}
