import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { postQueries } from "@entities/post/api/queries"
import { userQueries } from "@entities/user/api/queries"
import type { Post } from "@entities/post/model"
import type { User } from "@entities/user/model"
import { usePostsBrowseParams } from "./usePostsBrowseParams"

export const usePostsList = () => {
  const { params } = usePostsBrowseParams()
  const { skip, limit, searchQuery, sortBy, order, tag: selectedTag } = params

  const postQuery = useQuery({
    ...postQueries.listQuery({
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
    }),
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
    placeholderData: keepPreviousData,
  })

  const { data: users } = useQuery(userQueries.listQuery())
  const { data: tags } = useQuery(postQueries.tagQuery())

  const searchedPostsQuery = useQuery({
    ...postQueries.searchQuery({
      search: searchQuery,
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
    }),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  })

  const tagPostsQuery = useQuery({
    ...postQueries.listByTagQuery({
      tag: selectedTag,
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
    }),
    enabled: !!selectedTag && selectedTag !== "all",
    placeholderData: keepPreviousData,
  })

  const active =
    searchQuery && searchQuery.trim()
      ? searchedPostsQuery
      : selectedTag && selectedTag !== "all"
        ? tagPostsQuery
        : postQuery

  const isLoading = active.isLoading

  const posts =
    active.data?.posts?.map((post: Post) => ({
      ...post,
      author: users?.users?.find((user: User) => user.id === post.userId),
    })) ?? []

  const total = active.data?.total ?? 0

  return {
    posts,
    total,
    isLoading,
    tags,
  }
}
