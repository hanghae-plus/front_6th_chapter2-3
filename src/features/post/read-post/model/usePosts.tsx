import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getPosts, getPostBySearch, getPostByTag } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import type { Post, User, Author } from "@/shared/types"

export function usePosts() {
  const [searchParams] = useSearchParams()

  const filters = {
    skip: Number(searchParams.get("skip")) || 0,
    limit: Number(searchParams.get("limit")) || 10,
    searchQuery: searchParams.get("search") || "",
    selectedTag: searchParams.get("tag") || "",
    sortBy: (searchParams.get("sortBy") as "id" | "title" | "reactions" | "none") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", "list", filters],
    queryFn: async () => {
      const { searchQuery, selectedTag, ...otherFilters } = filters

      let postsResponse

      if (searchQuery) {
        // 검색어가 있으면 검색 API 사용
        postsResponse = await getPostBySearch(searchQuery)
      } else if (selectedTag && selectedTag !== "all") {
        // 태그가 있고 "all"이 아니면 태그 API 사용
        postsResponse = await getPostByTag(selectedTag)
      } else {
        // 둘 다 없으면 일반 목록 API 사용
        postsResponse = await getPosts(otherFilters)
      }

      // 사용자 정보 가져오기
      const usersResponse = await getUsers()

      const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
      const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) as Author }))

      return { posts, total: postsResponse.total }
    },
    staleTime: 30_000,
    gcTime: 10 * 60 * 1000,
  })

  return { posts: data?.posts, total: data?.total, isLoading, error }
}
