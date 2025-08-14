import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getPosts, getPostBySearch, getPostByTag } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { Post, Author } from "@/entities/post/model/types"
import { User } from "@/entities/user/model/types"

export function usePosts() {
  const [searchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      skip: Number(searchParams.get("skip")) || 0,
      limit: Number(searchParams.get("limit")) || 10,
      searchQuery: searchParams.get("search") || "",
      selectedTag: searchParams.get("tag") || "",
      sortBy: (searchParams.get("sortBy") as "id" | "title" | "reactions" | "none") || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
    }),
    [searchParams],
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", "list", filters],
    queryFn: async () => {
      const { searchQuery, selectedTag, ...otherFilters } = filters

      let postsResponse

      if (searchQuery) {
        // 검색어가 있으면 검색 API 사용 (페이지네이션 파라미터 포함)
        postsResponse = await getPostBySearch(searchQuery, otherFilters)
      } else if (selectedTag && selectedTag !== "all") {
        // 태그가 있고 "all"이 아니면 태그 API 사용 (페이지네이션 파라미터 포함)
        postsResponse = await getPostByTag(selectedTag, otherFilters)
      } else {
        // 둘 다 없으면 일반 목록 API 사용
        postsResponse = await getPosts(otherFilters)
      }

      const usersResponse = await getUsers()

      const map = new Map(usersResponse.users.map((u: User) => [u.id, u]))
      const posts = postsResponse.posts.map((po: Post) => ({ ...po, author: map.get(po.userId) as Author }))

      return { posts, total: postsResponse.total }
    },
    select: (data) => {
      if (!data) return data

      const { searchQuery, selectedTag, skip, limit } = filters

      // 태그 필터링이나 검색 시 백엔드에서 페이지네이션이 제대로 작동하지 않는 경우
      // 클라이언트 사이드에서 페이지네이션 적용
      if ((searchQuery || (selectedTag && selectedTag !== "all")) && data.posts.length > limit) {
        const startIndex = skip
        const endIndex = startIndex + limit
        const paginatedPosts = data.posts.slice(startIndex, endIndex)

        return {
          posts: paginatedPosts,
          total: data.total,
        }
      }

      return data
    },
  })

  return { posts: data?.posts, total: data?.total, isLoading, error }
}
