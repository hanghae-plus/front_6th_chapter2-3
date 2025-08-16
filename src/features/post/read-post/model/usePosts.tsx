import { useQuery } from "@tanstack/react-query"
import { getPosts, getPostBySearch, getPostByTag } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { POST_QK } from "@/entities/post/model"
import { useBaseQueryParams } from "@/shared/hooks"
import {
  sortPosts,
  paginateArray,
  shouldPaginate,
  createUserMap,
  enrichPostsWithAuthors,
  determinePostsDataFunction,
  type SortBy,
} from "@/shared/lib"

export function usePosts() {
  const baseQueryParams = useBaseQueryParams()

  const { data, isLoading, error } = useQuery({
    queryKey: POST_QK.list({ ...baseQueryParams }),
    queryFn: async () => {
      const { search: searchQuery, tag: selectedTag, ...otherFilters } = baseQueryParams

      const getPostsData = () => {
        const dataFunctionType = determinePostsDataFunction(searchQuery, selectedTag)

        switch (dataFunctionType) {
          case "search":
            return getPostBySearch(searchQuery!, otherFilters)
          case "tag":
            return getPostByTag(selectedTag!, otherFilters)
          default:
            return getPosts(otherFilters)
        }
      }

      const [postsResponse, usersResponse] = await Promise.all([getPostsData(), getUsers()])

      const userMap = createUserMap(usersResponse.users)
      const posts = enrichPostsWithAuthors(postsResponse.posts, userMap)

      return { posts, total: postsResponse.total }
    },
    select: (data) => {
      if (!data) return data

      const { search: searchQuery, tag: selectedTag, skip, limit, sortBy, sortOrder } = baseQueryParams

      // 정렬 적용 (sortBy가 undefined인 경우 기본값 처리)
      const validSortBy = (sortBy as SortBy) || "id"
      const sortedPosts = sortPosts(data.posts, validSortBy, sortOrder || "asc")

      // 검색이나 태그 필터가 적용된 경우에만 페이지네이션 처리
      const hasFilters = !!(searchQuery || (selectedTag && selectedTag !== "all"))
      const needsPagination = shouldPaginate(hasFilters, sortedPosts.length, limit)

      if (needsPagination) {
        const paginatedPosts = paginateArray(sortedPosts, { skip, limit })

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
