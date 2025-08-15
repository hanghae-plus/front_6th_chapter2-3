import { SearchInput } from '@/features/(post)/search-posts';
import { TagFilterSelect } from '@/features/(post)/filter-by-tag';
import { SortSelect } from '@/features/(post)/sort-posts';
import type { SortBy, SortOrder } from '../model/useInitialQueryParams';

type PostFiltersProps = {
  searchQuery: string;
  selectedTag: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  tags: string[];
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortByChange: (value: SortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onTagClick: (tag: string) => void;
};

export function PostFilters({
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  tags,
  onSearchChange,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
}: PostFiltersProps) {
  return (
    <div className='flex gap-4'>
      <div className='flex-1'>
        <SearchInput value={searchQuery} onChange={onSearchChange} />
      </div>
      <TagFilterSelect value={selectedTag} tags={tags} onChange={onTagChange} />
      <SortSelect
        sortBy={sortBy}
        sortOrder={sortOrder}
        onChangeBy={onSortByChange}
        onChangeOrder={onSortOrderChange}
      />
    </div>
  );
}
