import { useAtom } from 'jotai';

import {
  postsAtom,
  totalAtom,
  skipAtom,
  limitAtom,
  searchQueryAtom,
  sortByAtom,
  sortOrderAtom,
  tagsAtom,
  selectedTagAtom,
  loadingAtom,
} from '../atoms/index';

export function usePostsState() {
  const [posts] = useAtom(postsAtom);
  const [total] = useAtom(totalAtom);
  const [skip, setSkip] = useAtom(skipAtom);
  const [limit, setLimit] = useAtom(limitAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [tags] = useAtom(tagsAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [loading] = useAtom(loadingAtom);

  return {
    posts,
    total,
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    tags,
    selectedTag,
    setSelectedTag,
    loading,
  };
}
