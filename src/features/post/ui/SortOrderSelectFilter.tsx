import { useSearchParams } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared';

export const SortOrderSelectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  const handleSortOrderChange = (sort: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('sortOrder', sort);
      return params;
    });
  };

  return (
    <Select value={sortOrder} onValueChange={handleSortOrderChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='정렬 순서' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='asc'>오름차순</SelectItem>
        <SelectItem value='desc'>내림차순</SelectItem>
      </SelectContent>
    </Select>
  );
};
