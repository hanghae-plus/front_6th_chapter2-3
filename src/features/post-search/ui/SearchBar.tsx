import { Search } from 'lucide-react';

import React from 'react';

import { Input } from '../../../shared/ui';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <div className='flex-1'>
      <div className='relative'>
        <Search className='text-muted-foreground absolute left-2 top-2.5 h-4 w-4' />
        <Input
          placeholder='게시물 검색...'
          className='pl-8'
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          onKeyPress={handleSearchKeyPress}
        />
      </div>
    </div>
  );
};

export default SearchBar;