import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostStore } from "@/entities/post/model/store";
import {
  useGetSearchPostsQuery,
  useGetPostsByTagQuery,
} from "@/entities/post/api/hooks";
import { URLManager } from "@/shared/lib/urlManager";

export const usePosts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedTag,
    searchQuery,
    sortBy,
    sortOrder,
    pagination,
    setSelectedTag,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setPagination,
  } = usePostStore();

  // URL 파라미터 동기화
  useEffect(() => {
    const params = URLManager.parseURLParams(location.search);
    setPagination(params.skip || 0, params.limit || 10);
    setSearchQuery(params.search || "");
    setSortBy(params.sortBy || "");
    setSortOrder((params.sortOrder as "asc" | "desc") || "asc");
    setSelectedTag(params.tag || "");
  }, [
    location.search,
    setPagination,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
  ]);

  // 상태 변경 시 URL 업데이트 (URL 변경으로 인한 것이 아닌 경우에만)
  useEffect(() => {
    const params = URLManager.parseURLParams(location.search);
    const currentSkip = params.skip || 0;
    const currentLimit = params.limit || 10;
    const currentSearch = params.search || "";
    const currentSortBy = params.sortBy || "";
    const currentSortOrder = params.sortOrder || "asc";
    const currentTag = params.tag || "";

    // URL의 값과 현재 상태가 다를 때만 URL 업데이트
    if (
      currentSkip !== pagination.skip ||
      currentLimit !== pagination.limit ||
      currentSearch !== searchQuery ||
      currentSortBy !== sortBy ||
      currentSortOrder !== sortOrder ||
      currentTag !== selectedTag
    ) {
      URLManager.updateURL(navigate, {
        skip: pagination.skip,
        limit: pagination.limit,
        search: searchQuery,
        sortBy,
        sortOrder,
        tag: selectedTag,
      });
    }
  }, [
    pagination.skip,
    pagination.limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    navigate,
    location.search,
  ]);

  // 검색어 변경 시 페이지네이션 리셋
  useEffect(() => {
    if (searchQuery) {
      setPagination(0, pagination.limit);
    }
  }, [searchQuery, setPagination, pagination.limit]);

  // 정렬 기준 변경 시 페이지네이션 리셋
  useEffect(() => {
    setPagination(0, pagination.limit);
  }, [sortBy, sortOrder, setPagination, pagination.limit]);

  // TanStack Query 훅들
  const { data: searchData, isLoading: searchLoading } = useGetSearchPostsQuery(
    searchQuery,
    sortBy,
    sortOrder,
    { limit: pagination.limit, skip: pagination.skip },
    { enabled: true },
  );

  const { data: tagData, isLoading: tagLoading } = useGetPostsByTagQuery(
    selectedTag || "all",
    sortBy,
    sortOrder,
    { limit: pagination.limit, skip: pagination.skip },
    { enabled: true },
  );

  // 현재 표시할 데이터 결정
  const currentData = searchQuery ? searchData : tagData;
  const currentLoading = searchQuery ? searchLoading : tagLoading;

  return {
    // 상태
    posts: currentData?.posts || [],
    total: currentData?.total || 0,
    loading: currentLoading,
    pagination,
  };
};
