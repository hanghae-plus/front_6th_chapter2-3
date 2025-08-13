import { Post, NewPost, User } from '../types';

// PostsManagerPage.tsx에서 그대로 복사한 Post 관련 함수들

// 게시물 가져오기
export const fetchPosts = (
  setLoading: (loading: boolean) => void,
  setPosts: (posts: Post[]) => void,
  setTotal: (total: number) => void,
  limit: number,
  skip: number,
) => {
  setLoading(true);
  let postsData: any;
  let usersData: User[];

  fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    .then((response) => response.json())
    .then((data) => {
      postsData = data;
      return fetch('/api/users?limit=0&select=username,image');
    })
    .then((response) => response.json())
    .then((users) => {
      usersData = users.users;
      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.find((user: User) => user.id === post.userId),
      }));
      setPosts(postsWithUsers);
      setTotal(postsData.total);
    })
    .catch((error) => {
      console.error('게시물 가져오기 오류:', error);
    })
    .finally(() => {
      setLoading(false);
    });
};

// 게시물 검색
export const searchPosts = async (
  setLoading: (loading: boolean) => void,
  setPosts: (posts: Post[]) => void,
  setTotal: (total: number) => void,
  searchQuery: string,
  fetchPosts: () => void,
) => {
  if (!searchQuery) {
    fetchPosts();
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

// 태그별 게시물 가져오기
export const fetchPostsByTag = async (
  tag: string,
  setLoading: (loading: boolean) => void,
  setPosts: (posts: Post[]) => void,
  setTotal: (total: number) => void,
  fetchPosts: () => void,
) => {
  if (!tag || tag === 'all') {
    fetchPosts();
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
      author: usersData.users.find((user: User) => user.id === post.userId),
    }));

    setPosts(postsWithUsers);
    setTotal(postsData.total);
  } catch (error) {
    console.error('태그별 게시물 가져오기 오류:', error);
  }
  setLoading(false);
};

// 게시물 추가
export const addPost = async (
  newPost: NewPost,
  setPosts: (posts: Post[]) => void,
  posts: Post[],
  setShowAddDialog: (show: boolean) => void,
  setNewPost: (post: NewPost) => void,
) => {
  try {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    const data = await response.json();
    setPosts([data, ...posts]);
    setShowAddDialog(false);
    setNewPost({ title: '', body: '', userId: 1 });
  } catch (error) {
    console.error('게시물 추가 오류:', error);
  }
};

// 게시물 업데이트
export const updatePost = async (
  selectedPost: Post,
  setPosts: (posts: Post[]) => void,
  posts: Post[],
  setShowEditDialog: (show: boolean) => void,
) => {
  try {
    const response = await fetch(`/api/posts/${selectedPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPost),
    });
    const data = await response.json();
    setPosts(posts.map((post) => (post.id === data.id ? data : post)));
    setShowEditDialog(false);
  } catch (error) {
    console.error('게시물 업데이트 오류:', error);
  }
};

// 게시물 삭제
export const deletePost = async (id: number, setPosts: (posts: Post[]) => void, posts: Post[]) => {
  try {
    await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    setPosts(posts.filter((post) => post.id !== id));
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
  }
};
