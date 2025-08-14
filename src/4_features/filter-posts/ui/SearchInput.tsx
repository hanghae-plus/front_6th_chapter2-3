import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';

import { UI_CONSTANTS } from '@/shared/constants';
import { useDebounce, usePostsFilterStore } from '@/shared/lib';
import { Input } from '@/shared/ui';

export const SearchInput = () => {
  const { searchQuery, setSearchQuery } = usePostsFilterStore();
  const debouncedSetSearchQuery = useDebounce(
    (searchQuery: string) => setSearchQuery(searchQuery),
    500
  );

  const [originalSearchQuery, setOriginalSearchQuery] = useState(searchQuery);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOriginalSearchQuery(e.target.value);
  };

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setOriginalSearchQuery(e.currentTarget.value);
    }
  };

  useEffect(() => {
    debouncedSetSearchQuery(originalSearchQuery);
  }, [originalSearchQuery]);

  return (
    <div className='flex-1'>
      <div className='relative'>
        <Search
          className={`absolute left-2 top-2.5 ${UI_CONSTANTS.ICON_SIZES.MEDIUM} text-muted-foreground`}
        />
        <Input
          placeholder='게시물 검색...'
          className='pl-8'
          value={originalSearchQuery}
          onChange={handleChangeSearch}
          onKeyDown={handleKeyDownSearch}
        />
      </div>
    </div>
  );
};
