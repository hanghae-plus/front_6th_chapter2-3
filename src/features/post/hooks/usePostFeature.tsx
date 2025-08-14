// Post 상태 관리 훅

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Post, NewPost } from '../../../entities/post';
import { Tag } from '../../../entities/tag';
import {
  fetchPosts,
  searchPosts,
  fetchPostsByTag,
  addPost,
  updatePost,
  deletePost,
} from '../../../entities/post';
import { fetchTags } from '../../../entities/tag';
import { usePostStore } from '../store';

export const usePostFeature = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Phase 1: 기본 데이터 상태만 Zustand로 (기존 API 함수들과 호환)
  const {
    posts,
    selectedPost,
    newPost,
    setPosts,
    setSelectedPost,
    setNewPost,
    clearNewPost,
    clearSelectedPost,
  } = usePostStore();

  // Phase 1: 나머지 상태는 기존 useState로 유지 (기존 API 함수들과 호환)
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);

  // URL 업데이트 함수 (기존과 동일)
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 태그 가져오기 (기존과 동일)
  const handleFetchTags = async () => {
    await fetchTags(setTags);
  };

  // 게시물 상세 보기 (기존과 동일)
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  // API 호출 핸들러들 (기존과 동일, Zustand 스토어의 setPosts 사용)
  const handleFetchPosts = () => {
    fetchPosts(setLoading, setPosts, setTotal, limit, skip);
  };

  const handleSearchPosts = async () => {
    if (!searchQuery) {
      handleFetchPosts();
      return;
    }
    await searchPosts(setLoading, setPosts, setTotal, searchQuery, handleFetchPosts);
  };

  const handleFetchPostsByTag = async (tag: string) => {
    if (!tag || tag === 'all') {
      handleFetchPosts();
      return;
    }
    await fetchPostsByTag(setLoading, setPosts, setTotal, tag, handleFetchPosts);
  };

  const handleAddPost = async () => {
    await addPost(setPosts, posts, setShowAddDialog, setNewPost, newPost);
  };

  const handleUpdatePost = async () => {
    if (selectedPost) {
      await updatePost(setPosts, posts, setShowEditDialog, selectedPost);
    }
  };

  const handleDeletePost = async (id: number) => {
    await deletePost(setPosts, posts, id);
  };

  // useEffect들 (PostsManagerPage.tsx에서 그대로 복사)
  useEffect(() => {
    handleFetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      handleFetchPostsByTag(selectedTag);
    } else {
      handleFetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get('skip') || '0'));
    setLimit(parseInt(params.get('limit') || '10'));
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  return {
    // 상태
    posts,
    total,
    skip,
    limit,
    searchQuery,
    selectedPost,
    sortBy,
    sortOrder,
    showAddDialog,
    showEditDialog,
    newPost,
    loading,
    tags,
    selectedTag,
    showPostDetailDialog,
    // 상태 설정자
    setPosts,
    setTotal,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedPost,
    setSortBy,
    setSortOrder,
    setShowAddDialog,
    setShowEditDialog,
    setNewPost,
    setLoading,
    setTags,
    setSelectedTag,
    setShowPostDetailDialog,
    // 함수들
    updateURL,
    handleFetchTags,
    openPostDetail,
    handleFetchPosts,
    handleSearchPosts,
    handleFetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  };
};
