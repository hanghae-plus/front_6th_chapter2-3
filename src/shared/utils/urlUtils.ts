// URL 관련 유틸리티 함수들
export const updateURL = (
  navigate: (path: string) => void,
  params: {
    skip?: number;
    limit?: number;
    searchQuery?: string;
    sortBy?: string;
    sortOrder?: string;
    selectedTag?: string;
  }
) => {
  const urlParams = new URLSearchParams();
  if (params.skip) urlParams.set('skip', params.skip.toString());
  if (params.limit) urlParams.set('limit', params.limit.toString());
  if (params.searchQuery) urlParams.set('search', params.searchQuery);
  if (params.sortBy) urlParams.set('sortBy', params.sortBy);
  if (params.sortOrder) urlParams.set('sortOrder', params.sortOrder);
  if (params.selectedTag) urlParams.set('tag', params.selectedTag);
  navigate(`?${urlParams.toString()}`);
};
