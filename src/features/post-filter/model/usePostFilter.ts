import { create } from 'zustand';

import { Post, Tag, postApi } from '../../../entities/post';
import { userApi } from '../../../entities/user';
import { usePostList, PostWithUser } from '../../post-list';

interface PostFilterState {
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

interface PostFilterActions {
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setSelectedTag: (tag: string) => void;
  fetchTags: () => Promise<void>;
  fetchPostsByTag: (tag: string) => Promise<void>;
  clearFilters: () => void;
  setTags: (tags: Tag[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostFilter = create<PostFilterState & PostFilterActions>()((set) => ({
  sortBy: '',
  sortOrder: 'asc',
  selectedTag: '',
  tags: [],
  loading: false,
  error: null,

  setSortBy: (sortBy: string) => set({ sortBy }),
  setSortOrder: (sortOrder: string) => set({ sortOrder }),
  setSelectedTag: (tag: string) => set({ selectedTag: tag }),

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/posts/tags`);
      const data = await response.json();
      set({ tags: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('태그 가져오기 오류:', error);
    }
  },

  fetchPostsByTag: async (tag: string) => {
    if (!tag || tag === 'all') {
      // 태그가 없으면 일반 목록 로드
      const postListStore = usePostList.getState();
      postListStore.fetchPosts(postListStore.skip, postListStore.limit);
      return;
    }

    set({ loading: true, error: null, selectedTag: tag });
    try {
      const [postsData, usersData] = await Promise.all([
        postApi.getPostsByTag(tag),
        userApi.getUsersList(),
      ]);

      const postsWithUsers: PostWithUser[] = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));

      // post-list store에 태그 필터 결과 설정
      const postListStore = usePostList.getState();
      postListStore.setPosts(postsWithUsers);
      postListStore.setTotal(postsData.total);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('태그별 게시물 가져오기 오류:', error);
    }
  },

  clearFilters: () => {
    set({
      sortBy: '',
      sortOrder: 'asc',
      selectedTag: '',
      error: null,
    });
    // 필터 클리어 시 일반 목록 로드
    const postListStore = usePostList.getState();
    postListStore.fetchPosts(postListStore.skip, postListStore.limit);
  },

  setTags: (tags: Tag[]) => set({ tags }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));