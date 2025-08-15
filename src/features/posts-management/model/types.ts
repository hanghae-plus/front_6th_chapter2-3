import { Post } from '../../../entities/posts/model/types'

export interface PostWithAuthor extends Post {
  author?: {
    id: number
    username: string
    image: string
  }
}

export interface PostsTableProps {
  posts: PostWithAuthor[]
  searchQuery: string
  selectedTag: string
  onPostDetail: (post: PostWithAuthor) => void
  onEditPost: (post: PostWithAuthor) => void
  onDeletePost: (id: number) => void
  onUserClick: (user: any) => void
  onTagClick: (tag: string) => void
  onLikePost: (id: number) => void
  onDislikePost: (id: number) => void
}

export interface SearchAndFilterProps {
  searchQuery: string
  selectedTag: string
  tags: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSearchChange: (query: string) => void
  onSearch: () => void
  onTagChange: (tag: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (order: 'asc' | 'desc') => void
}

export interface PaginationProps {
  skip: number
  limit: number
  total: number
  onSkipChange: (skip: number) => void
  onLimitChange: (limit: number) => void
}
