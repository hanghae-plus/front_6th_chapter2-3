// 게시물 관련 비즈니스 로직 함수들 (usePostFeature에서만 사용)

// 게시물 검색 비즈니스 로직
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
    const response = await fetch(`/api/posts/search?q=${searchQuery}`);
    const data = await response.json();
    setPosts(data.posts);
    setTotal(data.total);
  } catch (error) {
    console.error('게시물 검색 오류:', error);
  }
  setLoading(false);
};

// 태그별 게시물 가져오기 비즈니스 로직
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
      fetch(`/api/posts/tag/${tag}`),
      fetch('/api/users?limit=0&select=username,image'),
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
