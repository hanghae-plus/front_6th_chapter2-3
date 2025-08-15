import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui';
import { Tag } from '../../entities/tag';

interface FilterBarProps {
  selectedTag: string;
  sortBy: string;
  sortOrder: string;
  tags: Tag[];
  onTagChange: (tag: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  onFetchPostsByTag: (tag: string) => void;
  updateURL: () => void;
}

export const FilterBar = ({
  selectedTag,
  sortBy,
  sortOrder,
  tags,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
  onFetchPostsByTag,
  updateURL,
}: FilterBarProps) => {
  return (
    <>
      <Select
        value={selectedTag}
        onValueChange={(value) => {
          onTagChange(value);
          onFetchPostsByTag(value);
          updateURL();
        }}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='태그 선택' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='정렬 기준' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>없음</SelectItem>
          <SelectItem value='id'>ID</SelectItem>
          <SelectItem value='title'>제목</SelectItem>
          <SelectItem value='reactions'>반응</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='정렬 순서' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='asc'>오름차순</SelectItem>
          <SelectItem value='desc'>내림차순</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
