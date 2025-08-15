import { Post, NewPost } from '../../../entities/post';
import { User } from '../../../entities/user';
import * as postAPI from '../../../entities/post/api';
import * as userAPI from '../../../entities/user/api';

// 상태 관리와 결합된 API 로직
export const usePostAPI = () => {
  // 게시물 가져오기 (사용자 정보 포함)
  const fetchPostsWithUsers = async (
    setLoading: (loading: boolean) => void,
    setPosts: (posts: Post[]) => void,
    setTotal: (total: number) => void,
    limit: number,
    skip: number,
  ) => {
    setLoading(true);
    try {
      const [postsData, usersData] = await Promise.all([
        postAPI.fetchPosts(limit, skip),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('게시물 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 게시물 검색 (사용자 정보 포함)
  const searchPostsWithUsers = async (
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
      const [postsData, usersData] = await Promise.all([
        postAPI.searchPosts(searchQuery),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('게시물 검색 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 태그별 게시물 가져오기 (사용자 정보 포함)
  const fetchPostsByTagWithUsers = async (
    setLoading: (loading: boolean) => void,
    setPosts: (posts: Post[]) => void,
    setTotal: (total: number) => void,
    tag: string,
    fetchPosts: () => void,
  ) => {
    if (!tag || tag === 'all') {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const [postsData, usersData] = await Promise.all([
        postAPI.fetchPostsByTag(tag),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error('태그별 게시물 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 게시물 추가 (사용자 정보 포함)
  const addPostWithUser = async (
    setPosts: (posts: Post[]) => void,
    posts: Post[],
    setShowAddDialog: (show: boolean) => void,
    setNewPost: (post: NewPost) => void,
    newPost: NewPost,
  ) => {
    try {
      const data = await postAPI.addPost(newPost);
      
      // 새 게시글에 author 정보 추가
      const usersData = await userAPI.fetchUsers();
      const newPostWithAuthor = {
        ...data,
        author: usersData.users.find((user: User) => user.id === data.userId),
      };

      setPosts([newPostWithAuthor, ...posts]);
      setShowAddDialog(false);
      setNewPost({ title: '', body: '', userId: 1 });
    } catch (error) {
      console.error('게시물 추가 오류:', error);
    }
  };

  // 게시물 업데이트
  const updatePostWithState = async (
    setPosts: (posts: Post[]) => void,
    posts: Post[],
    setShowEditDialog: (show: boolean) => void,
    selectedPost: Post,
  ) => {
    try {
      const data = await postAPI.updatePost(selectedPost.id, selectedPost);
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error('게시물 업데이트 오류:', error);
    }
  };

  // 게시물 삭제
  const deletePostWithState = async (
    setPosts: (posts: Post[]) => void,
    posts: Post[],
    id: number,
  ) => {
    try {
      await postAPI.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  return {
    fetchPostsWithUsers,
    searchPostsWithUsers,
    fetchPostsByTagWithUsers,
    addPostWithUser,
    updatePostWithState,
    deletePostWithState,
  };
};
