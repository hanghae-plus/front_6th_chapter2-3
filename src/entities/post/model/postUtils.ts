import { Post } from '../types';
import { httpClient } from '../../../shared/config/httpClient';

// 게시물 검색 (제목/내용 기반)
export const searchPosts = async (
  setLoading: (loading: boolean) => void,
  setPosts: (posts: any[]) => void,
  setTotal: (total: number) => void,
  searchQuery: string,
  handleFetchPosts: () => void,
) => {
  if (!searchQuery) {
    handleFetchPosts();
    return;
  }
  setLoading(true);
  try {
    const response = await httpClient.get(`/api/posts/search?q=${searchQuery}`);
    const data = await response.json();
    setPosts(data.posts);
    setTotal(data.total);
  } catch (error) {
    console.error('게시물 검색 오류:', error);
  }
  setLoading(false);
};

// 특정 태그의 게시물 조회 (사용자 정보 포함)
export const fetchPostsByTag = async (
  setLoading: (loading: boolean) => void,
  setPosts: (posts: any[]) => void,
  setTotal: (total: number) => void,
  tag: string,
  handleFetchPosts: () => void,
) => {
  if (!tag || tag === 'all') {
    handleFetchPosts();
    return;
  }
  setLoading(true);
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      httpClient.get(`/api/posts/tag/${tag}`),
      httpClient.get('/api/users?limit=0&select=username,image'),
    ]);
    const postsData = await postsResponse.json();
    const usersData = await usersResponse.json();

    const postsWithUsers = postsData.posts.map((post: any) => ({
      ...post,
      author: usersData.users.find((user: any) => user.id === post.userId),
    }));

    setPosts(postsWithUsers);
    setTotal(postsData.total);
  } catch (error) {
    console.error('태그별 게시물 가져오기 오류:', error);
  }
  setLoading(false);
};

// 게시물 상세 보기 (댓글은 TanStack Query가 자동으로 처리)
export const openPostDetailWithComments = (post: Post, openPostDetail: (post: Post) => void) => {
  openPostDetail(post);
};
