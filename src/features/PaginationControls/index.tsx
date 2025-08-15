import * as SelectPrimitive from '@radix-ui/react-select';
import React from 'react';

import { usePostsState } from '../../entities/post/model/hooks';
import { Button, SelectContent, SelectItem, SelectTrigger } from '../../shared/ui';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const PaginationControls: React.FC = () => {
  const { limit, setLimit, skip, setSkip, total } = usePostsState();

  const handlePrev = () => setSkip(Math.max(0, skip - limit));
  const handleNext = () => setSkip(skip + limit);

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value: string) => setLimit(Number(value))}>
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
        <Button disabled={skip === 0} onClick={handlePrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
