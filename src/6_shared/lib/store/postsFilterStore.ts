import { useEffect } from 'react';

import { atom, useAtom } from 'jotai';

import { SortOrder } from '@/shared/types';

export interface PostsFilterState {
  searchQuery: string;
  selectedTag: string;
  sortBy: string;
  sortOrder: SortOrder;
  skip: number;
  limit: number;
}

const initialFilterState: PostsFilterState = {
  searchQuery: '',
  selectedTag: '',
  sortBy: '',
  sortOrder: SortOrder.ASC,
  skip: 0,
  limit: 10,
};

// URL에서 초기 상태를 읽어오는 함수
const getInitialStateFromURL = (): PostsFilterState => {
  if (typeof window === 'undefined') return initialFilterState;

  const params = new URLSearchParams(window.location.search);
  return {
    searchQuery: params.get('search') || '',
    selectedTag: params.get('tag') || '',
    sortBy: params.get('sortBy') || '',
    sortOrder: (params.get('sortOrder') as SortOrder) || SortOrder.ASC,
    skip: parseInt(params.get('skip') || '0'),
    limit: parseInt(params.get('limit') || '10'),
  };
};

export const postsFilterAtom = atom<PostsFilterState>(getInitialStateFromURL());

// 개별 필터 atoms (더 세밀한 제어를 위해)
export const searchQueryAtom = atom(
  get => get(postsFilterAtom).searchQuery,
  (get, set, newValue: string) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      searchQuery: newValue,
    });
  }
);

export const selectedTagAtom = atom(
  get => get(postsFilterAtom).selectedTag,
  (get, set, newValue: string) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      selectedTag: newValue,
    });
  }
);

export const sortByAtom = atom(
  get => get(postsFilterAtom).sortBy,
  (get, set, newValue: string) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      sortBy: newValue,
    });
  }
);

export const sortOrderAtom = atom(
  get => get(postsFilterAtom).sortOrder,
  (get, set, newValue: SortOrder) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      sortOrder: newValue,
    });
  }
);

export const limitAtom = atom(
  get => get(postsFilterAtom).limit,
  (get, set, newValue: number) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      limit: newValue,
    });
  }
);

export const skipAtom = atom(
  get => get(postsFilterAtom).skip,
  (get, set, newValue: number) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      skip: newValue,
    });
  }
);

export const resetFiltersAtom = atom(null, (_, set) => {
  set(postsFilterAtom, initialFilterState);
});

// URL 동기화를 위한 atom
export const urlSyncAtom = atom(
  get => {
    const filter = get(postsFilterAtom);
    const params = new URLSearchParams();

    if (filter.skip > 0) params.set('skip', filter.skip.toString());
    if (filter.limit !== 10) params.set('limit', filter.limit.toString());
    if (filter.searchQuery) params.set('search', filter.searchQuery);
    if (filter.sortBy) params.set('sortBy', filter.sortBy);
    if (filter.sortOrder !== 'asc') params.set('sortOrder', filter.sortOrder);
    if (filter.selectedTag) params.set('tag', filter.selectedTag);

    return params.toString();
  },
  (_, set, urlParams: string) => {
    const params = new URLSearchParams(urlParams);
    const newState: PostsFilterState = {
      searchQuery: params.get('search') || '',
      selectedTag: params.get('tag') || '',
      sortBy: params.get('sortBy') || '',
      sortOrder: (params.get('sortOrder') as SortOrder) || SortOrder.ASC,
      skip: parseInt(params.get('skip') || '0'),
      limit: parseInt(params.get('limit') || '10'),
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

export const usePostsFilterStore = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [skip, setSkip] = useAtom(skipAtom);
  const [limit, setLimit] = useAtom(limitAtom);

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
  };
};
