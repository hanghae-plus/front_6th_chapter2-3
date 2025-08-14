import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUrlParams } from '../../../../shared/hooks/useUrlParams';

export const usePostsUrlParams = () => {
  const location = useLocation();
  const { getParam, setParams } = useUrlParams();

  const [skip, setSkip] = useState(parseInt(getParam('skip') || '0'));
  const [limit, setLimit] = useState(parseInt(getParam('limit') || '10'));
  const [searchQuery, setSearchQuery] = useState(getParam('search') || '');
  const [sortBy, setSortBy] = useState(getParam('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(getParam('sortOrder') || 'asc');

  useEffect(() => {
    setSkip(parseInt(getParam('skip') || '0'));
    setLimit(parseInt(getParam('limit') || '10'));
    setSearchQuery(getParam('search') || '');
    setSortBy(getParam('sortBy') || '');
    setSortOrder(getParam('sortOrder') || 'asc');
  }, [location.search, getParam]);

  const updatePostsURL = (params?: {
    skip?: number;
    limit?: number;
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: string;
    tag?: string;
  }) => {
    setParams({
      skip: params?.skip ?? skip,
      limit: params?.limit ?? limit,
      search: params?.searchQuery ?? searchQuery,
      sortBy: params?.sortBy ?? sortBy,
      sortOrder: params?.sortOrder ?? sortOrder,
      tag: params?.tag || getParam('tag'),
    });
  };

  const handleSetSkip = (newSkip: number) => {
    setSkip(newSkip);
    updatePostsURL({ skip: newSkip });
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    updatePostsURL({ limit: newLimit, skip: 0 }); // limit 변경 시 첫 페이지로
  };

  return {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    setSkip: handleSetSkip,
    setLimit: handleSetLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    updatePostsURL,
  };
};
