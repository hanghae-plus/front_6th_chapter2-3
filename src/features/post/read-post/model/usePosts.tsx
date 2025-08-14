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

      const { searchQuery, selectedTag, skip, limit, sortBy, sortOrder } = filters

      const sortedPosts = [...data.posts]

      if (sortBy === "reactions") {
        sortedPosts.sort((a, b) => {
          const aLikes = a.reactions?.likes || 0
          const bLikes = b.reactions?.likes || 0

          if (sortOrder === "desc") {
            return bLikes - aLikes // 내림차순 (좋아요 많은 순)
          } else {
            return aLikes - bLikes // 오름차순 (좋아요 적은 순)
          }
        })
      }

      if ((searchQuery || (selectedTag && selectedTag !== "all")) && sortedPosts.length > limit) {
        const startIndex = skip
        const endIndex = startIndex + limit
        const paginatedPosts = sortedPosts.slice(startIndex, endIndex)

        return {
          posts: paginatedPosts,
          total: data.total,
        }
      }

      return {
        posts: sortedPosts,
        total: data.total,
      }
    },
  })

  return { posts: data?.posts, total: data?.total, isLoading, error }
}
