import { create } from 'zustand';
import { TagsState } from './type';
import { fetchTags as fetchTagsAPI } from '../api/api';

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  selectedTag: '',
  loading: false,
  error: null,

  setTags: (tags) => set({ tags }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // 비동기 액션
  fetchTags: async () => {
    set({ loading: true, error: null });

    try {
      const tags = await fetchTagsAPI();
      set({ tags, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '태그를 불러오는데 실패했습니다',
        loading: false,
      });
    }
  },
}));
