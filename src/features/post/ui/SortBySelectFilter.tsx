import { useSearchParams } from 'react-router-dom';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../../shared';

export const SortBySelectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'none';

  const handleSortByChange = (sort: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (sort === 'none') {
        params.delete('sortBy');
      } else {
        params.set('sortBy', sort);
      }

      return params;
    });
  };

  return (
    <Select value={sortBy} onValueChange={handleSortByChange}>
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
  );
};
