import { create } from 'zustand';
import { LoadingState } from '../types/loading';

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingState: {},
  setLoading: (key, loading) =>
    set((state) => ({
      loadingState: { ...state.loadingState, [key]: loading },
    })),
  isLoading: (key) => get().loadingState[key] || false,
}));
