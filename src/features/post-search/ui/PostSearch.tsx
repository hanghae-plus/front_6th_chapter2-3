import { Search } from 'lucide-react';

import { Input } from '@/shared/ui';

export const PostSearch = ({ inputValue, setInputValue, handleSearch }) => {
  return (
    <div className='flex-1'>
      <div className='relative'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='게시물 검색...'
          className='pl-8'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    </div>
  );
};
