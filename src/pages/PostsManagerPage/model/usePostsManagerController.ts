import { useEffect } from 'react';

import { usePostActions, usePostsState } from '../../../entities/post/model/hooks';

export function usePostsManagerController() {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    limit,
    setLimit,
    skip,
    setSkip,
  } = usePostsState();
  const { fetchTags, fetchPosts, fetchPostsByTag, searchPosts } = usePostActions();

  // initial fetch
  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag && selectedTag !== 'all') {
      fetchPostsByTag(selectedTag);
    } else if (searchQuery) {
      searchPosts();
    } else {
      fetchPosts();
    }
  }, [selectedTag, searchQuery, limit, skip, sortBy, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    limit,
    setLimit,
    skip,
    setSkip,
  };
}
