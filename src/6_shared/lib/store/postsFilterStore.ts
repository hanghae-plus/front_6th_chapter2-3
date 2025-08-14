import { atom } from 'jotai';

import { SortOrder } from '../..';

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

export const postsFilterAtom = atom<PostsFilterState>(initialFilterState);

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

export const paginationAtom = atom(
  get => ({
    skip: get(postsFilterAtom).skip,
    limit: get(postsFilterAtom).limit,
  }),
  (get, set, newValue: { skip: number; limit: number }) => {
    set(postsFilterAtom, {
      ...get(postsFilterAtom),
      ...newValue,
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
