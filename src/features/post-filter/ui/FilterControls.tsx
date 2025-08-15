import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui';

interface FilterControlsProps {
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
  tags: any[];
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  onTagChange: (tag: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  sortBy,
  sortOrder,
  selectedTag,
  tags,
  onSortByChange,
  onSortOrderChange,
  onTagChange,
}) => {
  return (
    <div className='flex gap-4'>
      <Select value={selectedTag} onValueChange={onTagChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='태그 선택' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>모든 태그</SelectItem>
          {tags.map(tag => (
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
    </div>
  );
};

export default FilterControls;