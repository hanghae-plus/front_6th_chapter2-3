import { create } from 'zustand';

interface PostSearchState {
  searchQuery: string;
  inputValue: string;
  setSearchQuery: (query: string) => void;
  setInputValue: (value: string) => void;
}

export const usePostSearchStore = create<PostSearchState>((set) => ({
  searchQuery: '',
  inputValue: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setInputValue: (value) => set({ inputValue: value }),
}));
