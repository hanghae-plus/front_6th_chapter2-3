import { Search } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Input } from '../../../shared';

export const SearchInputFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      return;
    }

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }

      return params;
    });
  };
  return (
    <div className='flex-1'>
      <div className='relative'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='게시물 검색...'
          className='pl-8'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>
    </div>
  );
};
