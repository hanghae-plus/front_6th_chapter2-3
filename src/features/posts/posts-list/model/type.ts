export interface PostsUrlState {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;

  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: string) => void;

  initFromUrl: (searchParams: URLSearchParams) => void;
  toUrlParams: () => Record<string, string | number>;
}
