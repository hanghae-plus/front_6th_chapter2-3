import { create } from 'zustand';

interface PaginationState {
  limit: number;
  skip: number;
  setLimit: (limit: number) => void;
  setSkip: (skip: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  limit: 10,
  skip: 0,

  setLimit: (limit) => set({ limit, skip: 0 }),
  setSkip: (skip) => set({ skip }),
}));
