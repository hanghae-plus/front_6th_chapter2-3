import { Search } from 'lucide-react';
import { useSearchStore } from '../model/store';
import { Input } from '@/shared/ui/input';

interface PostSearchBarProps {
  placeholder?: string;
}

const PostSearchBar = ({
  placeholder = '게시물 검색...',
}: PostSearchBarProps) => {
  const { searchValue, setSearchValue, setSearchQuery } = useSearchStore();

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8 pr-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              setSearchQuery(searchValue);
            }
          }}
        />
      </div>
    </div>
  );
};

export default PostSearchBar;
