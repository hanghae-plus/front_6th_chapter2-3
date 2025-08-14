import { atom, useAtom } from 'jotai';

import { AllFilterParams, SORT_BY } from '@/entities/post';
import { UI_CONSTANTS } from '@/shared/constants';
import { EmptyStringable, PaginationMeta, SortOrder } from '@/shared/types';

export enum POST_QUERY_TYPE {
  BASE = 'base',
  SEARCH = 'search',
  TAG = 'tag',
}

export interface PostsFilterState {
  queryType: POST_QUERY_TYPE;
  filters: Omit<AllFilterParams, 'limit' | 'skip'>;
  pagination: {
    limit: number;
    skip: number;
    total: number;
  };
}

const initialFilterState: PostsFilterState = {
  queryType: POST_QUERY_TYPE.BASE,
  filters: {
    searchQuery: '',
    selectedTag: '',
    sortBy: '',
    sortOrder: SortOrder.ASC,
  },
  pagination: {
    limit: UI_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
    skip: UI_CONSTANTS.PAGINATION.DEFAULT_SKIP,
    total: 0,
  },
};

// URL에서 초기 상태를 읽어오는 함수
const getInitialStateFromURL = (): PostsFilterState => {
  if (typeof window === 'undefined') return initialFilterState;

  const params = new URLSearchParams(window.location.search);
  return {
    queryType: POST_QUERY_TYPE.BASE,
    filters: {
      searchQuery: params.get('search') || '',
      selectedTag: params.get('tag') || '',
      sortBy: (params.get('sortBy') as SORT_BY) || '',
      sortOrder: (params.get('sortOrder') as SortOrder) || SortOrder.ASC,
    },
    pagination: {
      skip: parseInt(params.get('skip') || '0'),
      limit: parseInt(params.get('limit') || '10'),
      total: parseInt(params.get('total') || '0'),
    },
  };
};

export const postsFilterAtom = atom<PostsFilterState>(getInitialStateFromURL());

// 개별 필터 atoms (더 세밀한 제어를 위해)
export const searchQueryAtom = atom(
  get => get(postsFilterAtom).filters.searchQuery,
  (get, set, newValue: string) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      filters: {
        ...get(postsFilterAtom).filters,
        searchQuery: newValue,
      },
    });
  }
);

export const selectedTagAtom = atom(
  get => get(postsFilterAtom).filters.selectedTag,
  (get, set, newValue: string) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      filters: {
        ...get(postsFilterAtom).filters,
        selectedTag: newValue,
      },
    });
  }
);

export const sortByAtom = atom(
  get => get(postsFilterAtom).filters.sortBy,
  (get, set, newValue: EmptyStringable<SORT_BY>) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      filters: {
        ...get(postsFilterAtom).filters,
        sortBy: newValue,
      },
    });
  }
);

export const sortOrderAtom = atom(
  get => get(postsFilterAtom).filters.sortOrder,
  (get, set, newValue: SortOrder) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      filters: {
        ...get(postsFilterAtom).filters,
        sortOrder: newValue,
      },
    });
  }
);

export const limitAtom = atom(
  get => get(postsFilterAtom).pagination.limit,
  (get, set, newValue: number) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      pagination: {
        ...get(postsFilterAtom).pagination,
        limit: newValue,
      },
    });
  }
);

export const skipAtom = atom(
  get => get(postsFilterAtom).pagination.skip,
  (get, set, newValue: number) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      pagination: {
        ...get(postsFilterAtom).pagination,
        skip: newValue,
      },
    });
  }
);

export const resetFiltersAtom = atom(null, (_, set) => {
  set(postsFilterAtom, initialFilterState);
});

export const paginationAtom = atom(
  get => get(postsFilterAtom).pagination,
  (get, set, newValue: PaginationMeta) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      pagination: newValue,
    });
  }
);

export const filtersAtom = atom(
  get => get(postsFilterAtom).filters,
  (get, set, newValue: AllFilterParams) => {
    set(postsFilterAtom, { ...get(postsFilterAtom), filters: newValue });
  }
);

export const queryTypeAtom = atom(
  get => get(postsFilterAtom).queryType,
  (get, set, newValue: POST_QUERY_TYPE) => {
    set(postsFilterAtom, { ...get(postsFilterAtom), queryType: newValue });
  }
);

// URL 동기화를 위한 atom
export const urlSyncAtom = atom(
  get => {
    const filter = get(postsFilterAtom);
    const params = new URLSearchParams();

    const { searchQuery, selectedTag, sortBy, sortOrder } = filter.filters;
    const { skip, limit } = filter.pagination;

    if (skip > 0) params.set('skip', skip.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);

    return params.toString();
  },
  (_, set, urlParams: string) => {
    const params = new URLSearchParams(urlParams);
    const newState: PostsFilterState = {
      queryType: POST_QUERY_TYPE.BASE,
      filters: {
        searchQuery: params.get('search') || '',
        selectedTag: params.get('tag') || '',
        sortBy: (params.get('sortBy') as SORT_BY) || '',
        sortOrder: (params.get('sortOrder') as SortOrder) || SortOrder.ASC,
      },
      pagination: {
        skip: parseInt(params.get('skip') || '0'),
        limit: parseInt(params.get('limit') || '10'),
        total: parseInt(params.get('total') || '0'),
      },
    };

    set(postsFilterAtom, newState);
  }
);

export const useURLSync = () => {
  const [urlSync, setUrlSync] = useAtom(urlSyncAtom);

  const updateURL = () => {
    const newURL = `${window.location.pathname}?${urlSync}`;
    window.history.pushState({}, '', newURL);
  };

  const syncFromURL = () => {
    const currentParams = window.location.search;
    if (currentParams) {
      setUrlSync(currentParams.substring(1));
    }
  };

  return { updateURL, syncFromURL };
};
