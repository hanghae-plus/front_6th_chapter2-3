export interface SearchFilterBarProps {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  tags: any[]
  onSearchChange: (query: string) => void
  onTagChange: (tag: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (order: string) => void
  onSearch: () => void
}
