import { create } from 'zustand';

import { Post, postApi } from '../../../entities/post';
import { userApi } from '../../../entities/user';

export interface PostWithUser extends Post {
  author: any;
}

interface PostListState {
  posts: PostWithUser[];
  total: number;
  loading: boolean;
  error: string | null;
  skip: number;
  limit: number;
}

interface PostListActions {
  fetchPosts: (skip: number, limit: number) => Promise<void>;
  setPosts: (posts: PostWithUser[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  clearPosts: () => void;
  
  // CRUD 결과 반영 (다른 feature에서 호출)
  addPostToList: (post: Post) => void;
  updatePostInList: (updatedPost: Post) => void;
  removePostFromList: (postId: number) => void;
}

export const usePostList = create<PostListState & PostListActions>()((set, get) => ({
  posts: [],
  total: 0,
  loading: false,
  error: null,
  skip: 0,
  limit: 10,

  fetchPosts: async (skip: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        postApi.getPosts(limit, skip),
        userApi.getUsersList(),
      ]);

      const postsWithUsers = postsResponse.posts.map((post: Post) => ({
        ...post,
        author: usersResponse.users.find((user: any) => user.id === post.userId),
      }));

      set({ 
        posts: postsWithUsers, 
        total: postsResponse.total,
        skip,
        limit,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('게시물 목록 가져오기 오류:', error);
    }
  },

  setPosts: (posts: PostWithUser[]) => set({ posts }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setSkip: (skip: number) => set({ skip }),
  setLimit: (limit: number) => set({ limit }),
  clearPosts: () => set({ posts: [], total: 0 }),

  // CRUD 결과 반영
  addPostToList: (post: Post) => {
    const { posts } = get();
    const newPost = { ...post, author: null }; // author는 별도로 설정 필요
    set({ posts: [newPost, ...posts] });
  },

  updatePostInList: (updatedPost: Post) => {
    const { posts } = get();
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id 
        ? { ...updatedPost, author: post.author } 
        : post
    );
    set({ posts: updatedPosts });
  },

  removePostFromList: (postId: number) => {
    const { posts } = get();
    const filteredPosts = posts.filter(post => post.id !== postId);
    set({ posts: filteredPosts });
  },
}));