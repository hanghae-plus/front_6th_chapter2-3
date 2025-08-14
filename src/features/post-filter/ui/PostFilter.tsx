import { usePostFilter } from '../model/usePostFilter';

import { useFetchTags } from '@/entities/post/model/usePosts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui';

export const PostFilter = () => {
  const { data: tagsData } = useFetchTags();
  const tags = tagsData || [];

  const { selectedTag, sortBy, sortOrder, setSelectedTag, setSortBy, setSortOrder } =
    usePostFilter();

  return (
    <>
      <Select value={selectedTag} onValueChange={setSelectedTag}>
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
      <Select value={sortBy} onValueChange={setSortBy}>
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
      <Select value={sortOrder} onValueChange={setSortOrder}>
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
