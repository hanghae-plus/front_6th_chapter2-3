import { useGetPosts } from "@entities/post/hooks/queries/useGetPosts"
import { useGetPostsWithSearch } from "@entities/post/hooks/queries/useGetPostsWithSearch"
import { useGetPostsWithTag } from "@entities/post/hooks/queries/useGetPostsWithTag"
import { Post } from "@entities/post/types"
import { useGetUsers } from "@entities/user/hooks/queries/useGetUsers"

interface UsePostsQueryParams {
  skip?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  searchQuery?: string
  selectedTag?: string
}

export const usePostsSelector = (params: UsePostsQueryParams) => {
  const { skip, limit, sortBy, sortOrder, searchQuery, selectedTag } = params

  const { data: hookPosts, isLoading: isLoadingPosts } = useGetPosts({
    skip,
    limit,
    sortBy,
    order: sortOrder,
  })

  const { data: hookPostsWithSearch, isLoading: isLoadingWithSearch } = useGetPostsWithSearch(searchQuery || "", {
    enabled: !!searchQuery,
  })

  const { data: hookPostsWithTag, isLoading: isLoadingWithTag } = useGetPostsWithTag(selectedTag || "", {
    enabled: !!selectedTag,
  })

  const { data: usersData } = useGetUsers({
    limit: 0,
    select: "id,username,image",
  })

  const mapPostsWithAuthor = (posts: Post[]) => {
    return posts.map((post) => ({
      ...post,
      author: usersData?.users.find((user) => user.id === post.userId),
    }))
  }

  if (searchQuery) {
    return {
      posts: mapPostsWithAuthor(hookPostsWithSearch?.posts || []),
      total: hookPostsWithSearch?.total || 0,
      isLoading: isLoadingWithSearch,
    }
  }

  if (selectedTag) {
    return {
      posts: mapPostsWithAuthor(hookPostsWithTag?.posts || []),
      total: hookPostsWithTag?.total || 0,
      isLoading: isLoadingWithTag,
    }
  }

  return {
    posts: mapPostsWithAuthor(hookPosts?.posts || []),
    total: hookPosts?.total || 0,
    isLoading: isLoadingPosts,
  }
}
