import { useEffect } from 'react';

import { useAtom } from 'jotai';

import {
  filtersAtom,
  limitAtom,
  paginationAtom,
  queryTypeAtom,
  searchQueryAtom,
  selectedTagAtom,
  skipAtom,
  sortByAtom,
  sortOrderAtom,
  useURLSync,
} from '../store/postsFilterStore';

export const usePostsFilterStore = () => {
  const [queryType, setQueryType] = useAtom(queryTypeAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [skip, setSkip] = useAtom(skipAtom);
  const [limit, setLimit] = useAtom(limitAtom);
  const [pagination, setPagination] = useAtom(paginationAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  const { updateURL, syncFromURL } = useURLSync();

  // 컴포넌트 마운트 시 URL에서 상태 복원
  useEffect(() => {
    syncFromURL();
  }, []);

  // 필터 상태 변경 시 URL 업데이트
  useEffect(() => {
    updateURL();
  }, [searchQuery, selectedTag, sortBy, sortOrder, skip, limit]);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      syncFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    queryType,
    setQueryType,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    skip,
    setSkip,
    limit,
    setLimit,
    pagination,
    setPagination,
    filters,
    setFilters,
  };
};
