import { queryOptions } from "@tanstack/react-query"
import { getPosts, getPostBySearch } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import type { PostFilter, Post, User, Author } from "@/shared/types"

// 게시물 + 작성자 join 쿼리 (통합)
export const postWithAuthorQueries = {
  list: (filters: PostFilter & { searchQuery?: string; selectedTag?: string }) =>
    queryOptions({
      queryKey: ["posts", "list", filters],
      queryFn: async () => {
        const { searchQuery, selectedTag, ...otherFilters } = filters

        // 검색어가 있으면 getPostBySearch, 없으면 getPosts
        const postsResponse = searchQuery
          ? await getPostBySearch(searchQuery)
          : await getPosts({ ...otherFilters, tag: selectedTag })

        // 사용자 정보 가져오기
        const usersResponse = await getUsers()

        const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
        const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) as Author }))

        return { posts, total: postsResponse.total }
      },
      staleTime: 30_000,
      gcTime: 10 * 60 * 1000,
    }),
}
