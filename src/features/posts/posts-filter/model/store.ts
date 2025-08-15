import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  selectedTag: string;
  sortBy: string;
  sortOrder: string;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedTag: '',
  sortBy: '',
  sortOrder: 'asc',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedTag: '',
      sortBy: '',
      sortOrder: 'asc',
    }),
}));
