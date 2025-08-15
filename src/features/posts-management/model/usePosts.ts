import { useQuery } from "@tanstack/react-query"
import {
  fetchPostsApi,
  PostDTO,
  searchPostsApi,
} from "../../../entities/posts/api"
import { fetchUsersApi } from "../../../entities/users/api"
import { fetchPostsByTagApi } from "../../../entities/posts/api/fetchPostsByTag"

interface UsePostsParams {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string
}

const getPosts = async ({ skip, limit, searchQuery, selectedTag }: UsePostsParams) => {
  let postsData
  if (searchQuery) {
    postsData = await searchPostsApi({ query: searchQuery })
  } else if (selectedTag && selectedTag !== "all") {
    postsData = await fetchPostsByTagApi(selectedTag)
  } else {
    postsData = await fetchPostsApi({ limit, skip })
  }

  const usersData = (await fetchUsersApi()).users

  const postsWithUsers = postsData.posts.map((post: PostDTO) => ({
    ...post,
    author: usersData.find((user) => user.id === post.userId),
  }))
  return { posts: postsWithUsers, total: postsData.total }
}

export const usePosts = ({
  skip,
  limit,
  searchQuery,
  sortBy,
  sortOrder,
  selectedTag,
}: UsePostsParams) => {
  return useQuery({
    queryKey: ["posts", { skip, limit, searchQuery, sortBy, sortOrder, selectedTag }],
    queryFn: () => getPosts({ skip, limit, searchQuery, sortBy, sortOrder, selectedTag }),
    placeholderData: (previousData) => previousData,
  })
}
