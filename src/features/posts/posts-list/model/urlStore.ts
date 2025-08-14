import { create } from 'zustand';
import { PostsUrlState } from './type';

export const usePostsUrlStore = create<PostsUrlState>((set, get) => ({
  skip: 0,
  limit: 10,
  searchQuery: '',
  sortBy: '',
  sortOrder: 'asc',

  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  initFromUrl: (searchParams) => {
    set({
      skip: parseInt(searchParams.get('skip') || '0'),
      limit: parseInt(searchParams.get('limit') || '10'),
      searchQuery: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || '',
      sortOrder: searchParams.get('sortOrder') || 'asc',
    });
  },

  toUrlParams: () => {
    const state = get();
    return {
      skip: state.skip,
      limit: state.limit,
      search: state.searchQuery,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    };
  },
}));
