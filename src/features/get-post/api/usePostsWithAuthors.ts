import { usePostsByTagQuery, usePostsQuery, usePostsSearchQuery } from "@/features/get-post/api"
import { useUsersQuery } from "@/features/get-user/api"

type UsePostsWithAuthorsParams = {
  limit: number
  skip: number
  search?: string
  tag?: string
}

export function usePostsWithAuthors({ limit, skip, search, tag }: UsePostsWithAuthorsParams) {
  const { data: postsData, isLoading: isPostsLoading } = usePostsQuery({ limit, skip })
  const { data: searchData, isLoading: isSearchLoading } = usePostsSearchQuery({ query: search })
  const { data: tagData, isLoading: isTagLoading } = usePostsByTagQuery({ tag: tag || "" })
  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery({ limit: 0 })

  const activeData = search?.trim()
    ? { data: searchData, loading: isSearchLoading }
    : tag && tag !== "all"
      ? { data: tagData, loading: isTagLoading }
      : { data: postsData, loading: isPostsLoading }

  const posts =
    !activeData.data || !usersData
      ? []
      : activeData.data.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))

  return {
    posts,
    total: activeData.data?.total || 0,
    loading: activeData.loading || isUsersLoading,
  }
}
