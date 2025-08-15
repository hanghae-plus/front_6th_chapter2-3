import { create } from 'zustand';

import { Post, postApi } from '../../../entities/post';
import { userApi } from '../../../entities/user';
import { usePostList, PostWithUser } from '../../post-list';

interface PostSearchState {
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

interface PostSearchActions {
  setSearchQuery: (query: string) => void;
  searchPosts: (query: string) => Promise<void>;
  clearSearch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostSearch = create<PostSearchState & PostSearchActions>()((set) => ({
  searchQuery: '',
  loading: false,
  error: null,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  searchPosts: async (query: string) => {
    if (!query.trim()) {
      // 검색어가 비어있으면 일반 목록 로드
      const postListStore = usePostList.getState();
      postListStore.fetchPosts(postListStore.skip, postListStore.limit);
      return;
    }

    set({ loading: true, error: null, searchQuery: query });
    try {
      const [postsData, usersData] = await Promise.all([
        postApi.searchPosts(query),
        userApi.getUsersList(),
      ]);

      const postsWithUsers: PostWithUser[] = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));
      
      // post-list store에 검색 결과 설정
      const postListStore = usePostList.getState();
      postListStore.setPosts(postsWithUsers);
      postListStore.setTotal(postsData.total);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('게시물 검색 오류:', error);
    }
  },

  clearSearch: () => {
    set({ searchQuery: '', error: null });
    // 검색 클리어 시 일반 목록 로드
    const postListStore = usePostList.getState();
    postListStore.fetchPosts(postListStore.skip, postListStore.limit);
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));