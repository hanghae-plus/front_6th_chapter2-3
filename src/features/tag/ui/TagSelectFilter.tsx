import { useSearchParams } from 'react-router-dom';

import { useTagListQuery } from '../../../entities/tag/api/queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/Select';

export const TagSelectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag') || 'all';
  const { data: tags } = useTagListQuery();

  const handleTagChange = (tag: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (tag === 'all') {
        params.delete('tag');
      } else {
        params.set('tag', tag);
      }

      return params;
    });
  };

  return (
    <Select value={selectedTag} onValueChange={handleTagChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='태그 선택' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>모든 태그</SelectItem>
        {tags?.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
