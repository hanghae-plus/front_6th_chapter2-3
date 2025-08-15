import { useEffect } from 'react';

import { usePostFilterStore } from './postFilterStore';

import { useUrlQuery } from '@/entities/post/model/useUrlQuery';

export const usePostFilter = () => {
  const { searchParams, updateQuery } = useUrlQuery();
  const { selectedTag, sortBy, sortOrder, setSelectedTag, setSortBy, setSortOrder } =
    usePostFilterStore();

  useEffect(() => {
    const tagFromUrl = searchParams.get('tag') || 'all';
    const sortByFromUrl = searchParams.get('sortBy') || 'id';
    const sortOrderFromUrl = searchParams.get('sortOrder') || 'asc';

    setSelectedTag(tagFromUrl);
    setSortBy(sortByFromUrl);
    setSortOrder(sortOrderFromUrl);
  }, [searchParams]);

  const handleSetTag = (tag: string) => {
    setSelectedTag(tag);
    updateQuery({ tag: tag === 'all' ? null : tag });
  };

  const handleSetSortBy = (sort: string) => {
    setSortBy(sort);
    updateQuery({ sortBy: sort });
  };

  const handleSetSortOrder = (order: string) => {
    setSortOrder(order);
    updateQuery({ sortOrder: order });
  };

  return {
    selectedTag,
    sortBy,
    sortOrder,
    setSelectedTag: handleSetTag,
    setSortBy: handleSetSortBy,
    setSortOrder: handleSetSortOrder,
  };
};
