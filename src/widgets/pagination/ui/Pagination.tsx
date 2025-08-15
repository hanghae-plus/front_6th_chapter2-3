import { useSearchParams } from 'react-router-dom';

import { usePosts } from '../../../features';
import { Button } from '../../../shared/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/Select';

export const Pagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const limit = Number(searchParams.get('limit') || 10);
  const skip = Number(searchParams.get('skip') || 0);
  const tag = searchParams.get('tag') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const sortOrder = searchParams.get('sortOrder') || '';

  const { total } = usePosts({
    skip,
    limit,
    searchQuery,
    tag,
    sortBy,
    sortOrder,
  });

  const handleLimitChange = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('limit', value);
      params.set('skip', '0');
      return params;
    });
  };

  const handleSkipPrevClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('skip', Math.max(0, skip - limit).toString());
      return params;
    });
  };

  const handleSkipNextClick = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('skip', (skip + limit).toString());
      return params;
    });
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='10' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='20'>20</SelectItem>
            <SelectItem value='30'>30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className='flex gap-2'>
        <Button disabled={skip === 0} onClick={handleSkipPrevClick}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleSkipNextClick}>
          다음
        </Button>
      </div>
    </div>
  );
};
