import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '../../../shared/ui';
import { useFilterStore } from '../../../features/posts/filter-posts/model/store';
import { usePostsFilter } from '../../../features/posts/filter-posts/model/hooks';
import { useTagsStore } from '../../../entities/tags/model/store';

export const PostsFilter = () => {
  const { searchQuery, selectedTag, sortBy, sortOrder, setSearchQuery } = useFilterStore();
  const { handleSearch, handleTagChange, handleSortByChange, handleSortOrderChange, clearFilters } =
    usePostsFilter();
  const { tags } = useTagsStore();

  return (
    <div className='flex gap-4'>
      <div className='flex-1'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='게시물 검색...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>

      <Select value={selectedTag || 'all'} onValueChange={handleTagChange}>
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

      <Select value={sortBy || 'none'} onValueChange={handleSortByChange}>
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

      <Select value={sortOrder} onValueChange={handleSortOrderChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='정렬 순서' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='asc'>오름차순</SelectItem>
          <SelectItem value='desc'>내림차순</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' size='icon' onClick={clearFilters} title='필터 초기화'>
        <RotateCcw className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default PostsFilter;
