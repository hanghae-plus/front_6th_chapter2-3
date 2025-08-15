import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUrl } from '../lib/updateUrl';
import type { HomeQueryParams, SortBy, SortOrder } from './useInitialQueryParams';

export type UrlSyncParams = {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  selectedTag: string;
};

export type UrlSyncActions = {
  setSkip: (value: number) => void;
  setPageSize: (value: number) => void;
  setQuery: (value: string) => void;
  setSortBy: (value: SortBy) => void;
  setSortOrder: (value: SortOrder) => void;
  setSelectedTag: (value: string) => void;
};

export function useUrlSync(
  params: UrlSyncParams,
  actions: UrlSyncActions,
  initial: HomeQueryParams,
) {
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  const updateURL = () => {
    updateUrl(navigate, {
      skip: params.skip,
      limit: params.limit,
      search: params.searchQuery,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      tag: params.selectedTag,
    });
  };

  // 상태 변경 시 URL 업데이트 (초기 마운트 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateURL();
  }, [
    params.skip,
    params.limit,
    params.sortBy,
    params.sortOrder,
    params.selectedTag,
    params.searchQuery,
  ]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // 타입 안전한 파싱
    const skipParam = urlParams.get('skip');
    const limitParam = urlParams.get('limit');
    const searchParam = urlParams.get('search');
    const sortByParam = urlParams.get('sortBy');
    const sortOrderParam = urlParams.get('sortOrder');
    const tagParam = urlParams.get('tag');

    const skip = skipParam ? parseInt(skipParam, 10) : initial.skip;
    const limit = limitParam ? parseInt(limitParam, 10) : initial.limit;
    const search = searchParam || initial.searchQuery;

    const sortBy: SortBy =
      sortByParam === 'none' ||
      sortByParam === 'id' ||
      sortByParam === 'title' ||
      sortByParam === 'reactions'
        ? sortByParam
        : initial.sortBy;

    const sortOrder: SortOrder =
      sortOrderParam === 'asc' || sortOrderParam === 'desc' ? sortOrderParam : initial.sortOrder;

    const tag = tagParam || initial.selectedTag;

    actions.setSkip(isNaN(skip) ? initial.skip : skip);
    actions.setPageSize(isNaN(limit) ? initial.limit : limit);
    actions.setQuery(search);
    actions.setSortBy(sortBy);
    actions.setSortOrder(sortOrder);
    actions.setSelectedTag(tag);
  }, [
    location.search,
    actions.setQuery,
    actions.setSortBy,
    actions.setSortOrder,
    actions.setSelectedTag,
    actions.setPageSize,
    actions.setSkip,
    initial.skip,
    initial.limit,
    initial.searchQuery,
    initial.sortBy,
    initial.sortOrder,
    initial.selectedTag,
  ]);

  return { updateURL };
}
