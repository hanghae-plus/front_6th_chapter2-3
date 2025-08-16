import { fetchPosts, fetchPostsByTag, fetchPostsSearch, SortBy, SortOrder } from "@/entities/Post/api"
import { fetchUserProfiles } from "@/entities/User/api"
import { useQuery } from "@tanstack/react-query"

interface QueryPostsParams {
  searchQuery?: string
  selectedTag?: string
  limit?: number
  skip?: number
  sortBy?: SortBy
  sortOrder?: SortOrder
}

export const useQueryPosts = ({ searchQuery, selectedTag, limit, skip, sortBy, sortOrder }: QueryPostsParams = {}) => {
  const paginationParams = { limit, skip, sortBy, sortOrder }

  return useQuery({
    queryKey: ["posts", { searchQuery, paginationParams, selectedTag }],
    queryFn: async () => {
      let postsData

      if (searchQuery) {
        postsData = await fetchPostsSearch(searchQuery, paginationParams)
      } //
      else if (selectedTag && selectedTag !== "all") {
        postsData = await fetchPostsByTag(selectedTag, paginationParams)
      } //
      else {
        postsData = await fetchPosts(paginationParams)
      }

      const usersData = await fetchUserProfiles()
      const postsWithAuthors = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId)!,
      }))

      return {
        posts: postsWithAuthors,
        total: postsData.total,
      }
    },
  })
}
