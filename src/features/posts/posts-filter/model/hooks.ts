import { useCallback } from 'react';
import { usePostsStore } from '../../../../entities/post/model/store';
import { usePostsUrlParams } from '../../posts-list/model/hooks';
import { fetchFilteredPosts } from '../api/api';
import { useFilterStore } from './store';

export const usePostsFilter = () => {
  const { setPosts, setTotal, setLoading } = usePostsStore();
  const {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    clearFilters: clearFilterState,
  } = useFilterStore();
  const { skip, limit, updatePostsURL } = usePostsUrlParams();

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFilteredPosts({
        limit,
        skip,
        search: searchQuery,
        sortBy,
        sortOrder,
        tag: selectedTag,
      });

      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('필터링된 게시물 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [limit, skip, searchQuery, sortBy, sortOrder, selectedTag, setPosts, setTotal, setLoading]);

  const handleSearch = useCallback(() => {
    updatePostsURL({
      searchQuery,
      skip: 0,
    });
    applyFilters();
  }, [searchQuery, updatePostsURL, applyFilters]);

  const handleTagChange = useCallback(
    (tag: string) => {
      setSelectedTag(tag);
      updatePostsURL({
        tag,
        skip: 0,
      });
      applyFilters();
    },
    [setSelectedTag, updatePostsURL, applyFilters],
  );

  const handleSortByChange = useCallback(
    (newSortBy: string) => {
      setSortBy(newSortBy);
      updatePostsURL({
        sortBy: newSortBy,
        skip: 0,
      });
      applyFilters();
    },
    [setSortBy, updatePostsURL, applyFilters],
  );

  const handleSortOrderChange = useCallback(
    (newSortOrder: string) => {
      setSortOrder(newSortOrder);
      updatePostsURL({
        sortOrder: newSortOrder,
        skip: 0,
      });
      applyFilters();
    },
    [setSortOrder, updatePostsURL, applyFilters],
  );

  const clearFilters = useCallback(() => {
    clearFilterState();
    updatePostsURL({
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc',
      tag: '',
      skip: 0,
    });
    applyFilters();
  }, [clearFilterState, updatePostsURL, applyFilters]);

  return {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSearchQuery,
    handleSearch,
    handleTagChange,
    handleSortByChange,
    handleSortOrderChange,
    clearFilters,
    applyFilters,
  };
};
