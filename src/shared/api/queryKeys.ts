export type PostsListParams = {
  limit: number
  skip: number
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
}

export const postsKey = {
  all: ["posts"] as const,
  list: (params: PostsListParams) => ["posts", params] as const,
}

export const commentsKey = {
  byPost: (postId: number | null) => ["comments", postId] as const,
}


