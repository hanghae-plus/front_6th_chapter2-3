import { useUrlQuery } from '@/shared/hooks/useUrlQuery';

export const usePostFilter = () => {
  const { searchParams, updateQuery } = useUrlQuery();

  const selectedTag = searchParams.get('tag') || 'all';
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  const setSelectedTag = (tag: string) => updateQuery({ tag: tag === 'all' ? null : tag });
  const setSortBy = (sort: string) => updateQuery({ sortBy: sort });
  const setSortOrder = (order: string) => updateQuery({ sortOrder: order });

  return {
    selectedTag,
    sortBy,
    sortOrder,
    setSelectedTag,
    setSortBy,
    setSortOrder,
  };
};
