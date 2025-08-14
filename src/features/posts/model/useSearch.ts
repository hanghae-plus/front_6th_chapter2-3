import { create } from 'zustand';
import { useEffect } from 'react';
import { useSearchQuery } from '@/entities/posts';

interface SearchState {
  search: string;
  setSearch: (search: string) => void;
}

const _useSearch = create<SearchState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}));

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const { search, setSearch } = _useSearch();

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery, setSearch]);

  const commitSearch = () => {
    setSearchQuery(search);
  };

  return { search, setSearch, commitSearch };
};
