import type { Post } from "../entities/Post/Post"
import { useQueryPosts, useQueryPostsBySearch, useQueryPostsByTag } from "../entities/Post/api"
import type { User } from "../entities/User/User"
import { useQueryUsers } from "../entities/User/api"
import { useQueryParams } from "./useQueryParams"

export function usePosts() {
  const { skip, limit, selectedTag, searchQueryKeyword } = useQueryParams()

  const { data: postsData, isLoading: isPostsLoading } = useQueryPosts(limit, skip)
  const { data: postsByTagData, isLoading: isPostsByTagLoading } = useQueryPostsByTag(selectedTag, limit, skip)
  const { data: postsBySearchData, isLoading: isPostsBySearchLoading } = useQueryPostsBySearch(searchQueryKeyword)
  const { data: usersData, isLoading: isUsersLoading } = useQueryUsers(0, null, "username,image")

  const currentPostsData = searchQueryKeyword
    ? postsBySearchData
    : selectedTag && selectedTag !== "all"
      ? postsByTagData
      : postsData

  const loading = isPostsLoading || isPostsByTagLoading || isPostsBySearchLoading || isUsersLoading

  const total = currentPostsData?.total || 0

  const posts: Post[] =
    currentPostsData?.posts.map((post) => ({
      ...post,
      author: usersData?.users.find((user) => user.id === post.userId) as User,
    })) || []

  return {
    posts,
    total,
    loading,
  }
}
