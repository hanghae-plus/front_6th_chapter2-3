import { useQuery } from "@tanstack/react-query"
import { getPosts, getPostBySearch, getPostByTag } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { Post, Author, POST_QK } from "@/entities/post/model"
import { User } from "@/entities/user/model"
import { useBaseQueryParams } from "@/shared/hooks"

export function usePosts() {
  const baseQueryParams = useBaseQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: POST_QK.list({ ...baseQueryParams }),
    queryFn: async () => {
      const { search: searchQuery, tag: selectedTag, ...otherFilters } = baseQueryParams

      const getPostsData = () => {
        if (searchQuery) {
          return getPostBySearch(searchQuery, otherFilters)
        }
        if (selectedTag && selectedTag !== "all") {
          return getPostByTag(selectedTag, otherFilters)
        }
        return getPosts(otherFilters)
      }

      const [postsResponse, usersResponse] = await Promise.all([getPostsData(), getUsers()])

      const userMap = new Map(usersResponse.users.map((u: User) => [u.id, u]))
      const posts = postsResponse.posts.map((po: Post) => ({
        ...po,
        author: userMap.get(po.userId) as Author,
      }))

      return { posts, total: postsResponse.total }
    },
    select: (data) => {
      if (!data) return data

      const { search: searchQuery, tag: selectedTag, skip, limit, sortBy, sortOrder } = baseQueryParams

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

      // 검색이나 태그 필터가 적용된 경우에만 페이지네이션 처리
      const shouldPaginate =
        (searchQuery || (selectedTag && selectedTag !== "all")) && sortedPosts.length > (limit || 0)

      if (shouldPaginate) {
        const startIndex = skip || 0
        const endIndex = startIndex + (limit || 0)
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
