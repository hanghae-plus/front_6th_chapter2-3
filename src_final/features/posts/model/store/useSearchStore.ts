import { create } from 'zustand';

interface SearchState {
  searchValue: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSearchValue: (value: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchValue: '',
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchValue: (value) => {
    set({ searchValue: value });
  },
}));
