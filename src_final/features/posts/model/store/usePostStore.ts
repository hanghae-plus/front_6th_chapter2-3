import { create } from 'zustand';

interface PostFilterState {
  skip: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
}

interface PostFilterActions {
  setFilter: <K extends keyof PostFilterState>(
    key: K,
    value: PostFilterState[K],
  ) => void;
}

export const usePostFilterStore = create<PostFilterState & PostFilterActions>(
  (set) => ({
    skip: 0,
    limit: 10,
    sortBy: '',
    sortOrder: 'asc',
    selectedTag: '',
    setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  }),
);
