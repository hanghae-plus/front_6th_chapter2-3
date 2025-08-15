import { Search } from 'lucide-react';

import { usePostSearch } from '../model/usePostSearch';

import { Input } from '@/shared/ui';

export const PostSearch = () => {
  const { inputValue, setInputValue, confirmSearch } = usePostSearch();

  return (
    <div className='flex-1'>
      <div className='relative'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='게시물 검색...'
          className='pl-8'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && confirmSearch()}
        />
      </div>
    </div>
  );
};
