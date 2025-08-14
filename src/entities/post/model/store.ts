import { create } from 'zustand';
import { PostsState } from './type';
import { fetchPostsWithAuthors } from '../../../features/posts/list-posts/api';

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  total: 0,
  loading: false,
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  fetchPosts: async (limit, skip) => {
    set({ loading: true });
    try {
      const data = await fetchPostsWithAuthors(limit, skip);
      set({ posts: data.posts, total: data.total });
    } catch (error) {
      console.error('게시물 가져오기 오류', error);
    } finally {
      set({ loading: false });
    }
  },
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));
