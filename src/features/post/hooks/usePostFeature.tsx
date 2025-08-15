// Post 상태 관리 훅 (TanStack Query 적용)

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Post, NewPost } from '../../../entities/post';
import { Tag } from '../../../entities/tag';
import { fetchTags } from '../../../entities/tag';
import { usePostStore } from '../store';
import { updateURL as updateURLUtil } from '../../../shared/utils';
import {
  usePosts,
  useSearchPosts,
  usePostsByTag,
  useAddPost,
  useUpdatePost,
  useDeletePost,
} from './usePostQueries';

export const usePostFeature = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 클라이언트 상태 (UI 상태) - Zustand 사용
  const { selectedPost, newPost, setSelectedPost, setNewPost, clearNewPost, clearSelectedPost } =
    usePostStore();

  // 클라이언트 상태 (UI 상태) - useState 사용
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'sortBy');
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '');
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);

  // URL 업데이트 함수
  const updateURL = () => {
    updateURLUtil(navigate, { skip, limit, searchQuery, sortBy, sortOrder, selectedTag });
  };

  // 태그 가져오기
  const handleFetchTags = async () => {
    await fetchTags(setTags);
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  // TanStack Query 훅들 사용
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts(limit, skip);
  const { data: searchData, isLoading: searchLoading } = useSearchPosts(searchQuery);
  const { data: tagData, isLoading: tagLoading } = usePostsByTag(selectedTag);

  const addPostMutation = useAddPost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // 현재 표시할 데이터 결정
  const getCurrentPostsData = () => {
    if (searchQuery && searchData) {
      return searchData;
    }
    if (selectedTag && selectedTag !== 'all' && tagData) {
      return tagData;
    }
    return postsData || { posts: [], total: 0 };
  };

  const currentData = getCurrentPostsData();
  const posts = currentData.posts;
  const total = currentData.total;
  const loading = postsLoading || searchLoading || tagLoading;

  // 게시글 추가
  const handleAddPost = async () => {
    if (!newPost.title || !newPost.body) return;

    addPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false);
        setNewPost({ title: '', body: '', userId: 1 });
      },
      onError: (error) => {
        console.error('게시글 추가 오류:', error);
      },
    });
  };

  // 게시글 수정
  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    updatePostMutation.mutate(
      { id: selectedPost.id, post: selectedPost },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelectedPost(null);
        },
        onError: (error) => {
          console.error('게시글 수정 오류:', error);
        },
      },
    );
  };

  // 게시글 삭제
  const handleDeletePost = async (id: number) => {
    deletePostMutation.mutate(id, {
      onError: (error) => {
        console.error('게시글 삭제 오류:', error);
      },
    });
  };

  // 게시글 검색
  const handleSearchPosts = () => {
    // TanStack Query가 자동으로 검색을 처리함
    updateURL();
  };

  // 태그별 게시글 가져오기
  const handleFetchPostsByTag = (tag: string) => {
    // TanStack Query가 자동으로 태그별 게시글을 처리함
    updateURL();
  };

  // useEffect들 (PostsManagerPage.tsx에서 그대로 복사)
  useEffect(() => {
    handleFetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      handleFetchPostsByTag(selectedTag);
    } else {
      // TanStack Query가 자동으로 태그 없이 게시글을 가져옴
      updateURL();
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
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedPost,
    setSortBy,
    setSortOrder,
    setShowAddDialog,
    setShowEditDialog,
    setNewPost,
    setTags,
    setSelectedTag,
    setShowPostDetailDialog,
    // 함수들
    updateURL,
    handleFetchTags,
    openPostDetail,
    handleSearchPosts,
    handleFetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  };
};
