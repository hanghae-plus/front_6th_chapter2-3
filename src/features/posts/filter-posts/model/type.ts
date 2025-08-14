export interface PostsFilter {
  searchQuery: string;
  selectedTag: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PostsFilterState extends PostsFilter {
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export interface FilterApiParams {
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  tag?: string;
}
