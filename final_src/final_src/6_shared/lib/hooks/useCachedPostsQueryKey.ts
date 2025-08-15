import { useEffect, useState } from 'react';

import {
  AllFilterParams,
  BaseFilterParams,
  ParamsWithSearch,
  ParamsWithTag,
} from '@/entities/post';

import { queryKeys } from '../query/queryKeys';
import { POST_QUERY_TYPE } from '../store/postsFilterStore';
import { usePostsFilterStore } from './usePostsFilterStore';

export const useCachedPostsQueryKey = () => {
  const {
    queryType,
    filters: { searchQuery, selectedTag, sortBy, sortOrder },
    pagination: { limit, skip },
  } = usePostsFilterStore();

  const [params, setParams] = useState<Partial<AllFilterParams>>({
    limit,
    skip,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    if (queryType === POST_QUERY_TYPE.SEARCH) {
      const paramsWithSearch: ParamsWithSearch = {
        limit,
        skip,
        sortBy,
        sortOrder,
        searchQuery,
      };
      setParams(paramsWithSearch);
      return;
    }

    if (queryType === POST_QUERY_TYPE.TAG) {
      const paramsWithTag: ParamsWithTag = {
        limit,
        skip,
        sortBy,
        sortOrder,
        selectedTag,
      };
      setParams(paramsWithTag);
      return;
    }

    const baseParams: BaseFilterParams = {
      limit,
      skip,
      sortBy,
      sortOrder,
    };
    setParams(baseParams);
  }, [queryType, limit, skip, sortBy, sortOrder, searchQuery, selectedTag]);

  return queryKeys.posts.list(params);
};
