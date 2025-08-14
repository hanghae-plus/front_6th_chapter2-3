// Post API 호출 로직

import {
  fetchPosts,
  searchPosts,
  fetchPostsByTag,
  addPost,
  updatePost,
  deletePost,
} from '../../../entities/post';

// 게시물 가져오기
export const handleFetchPosts = (
  setLoading: any,
  setPosts: any,
  setTotal: any,
  limit: number,
  skip: number,
) => {
  fetchPosts(setLoading, setPosts, setTotal, limit, skip);
};

// 게시물 검색
export const handleSearchPosts = async (
  setLoading: any,
  setPosts: any,
  setTotal: any,
  searchQuery: string,
  handleFetchPosts: () => void,
) => {
  if (!searchQuery) {
    handleFetchPosts();
    return;
  }
  await searchPosts(setLoading, setPosts, setTotal, searchQuery, handleFetchPosts);
};

// 태그별 게시물 가져오기
export const handleFetchPostsByTag = async (
  tag: string,
  setLoading: any,
  setPosts: any,
  setTotal: any,
  handleFetchPosts: () => void,
) => {
  if (!tag || tag === 'all') {
    handleFetchPosts();
    return;
  }
  await fetchPostsByTag(tag, setLoading, setPosts, setTotal, handleFetchPosts);
};

// 게시물 추가
export const handleAddPost = async (
  newPost: any,
  setPosts: any,
  posts: any[],
  setShowAddDialog: any,
  setNewPost: any,
) => {
  await addPost(newPost, setPosts, posts, setShowAddDialog, setNewPost);
};

// 게시물 업데이트
export const handleUpdatePost = async (
  selectedPost: any,
  setPosts: any,
  posts: any[],
  setShowEditDialog: any,
) => {
  if (selectedPost) {
    await updatePost(selectedPost, setPosts, posts, setShowEditDialog);
  }
};

// 게시물 삭제
export const handleDeletePost = async (id: number, setPosts: any, posts: any[]) => {
  await deletePost(id, setPosts, posts);
};
