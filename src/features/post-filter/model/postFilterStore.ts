import { create } from 'zustand';

interface PostFilterState {
  selectedTag: string;
  sortBy: string;
  sortOrder: string;
  setSelectedTag: (tag: string) => void;
  setSortBy: (sort: string) => void;
  setSortOrder: (order: string) => void;
}

export const usePostFilterStore = create<PostFilterState>((set) => ({
  selectedTag: 'all',
  sortBy: 'id',
  sortOrder: 'asc',
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSortOrder: (order) => set({ sortOrder: order }),
}));
