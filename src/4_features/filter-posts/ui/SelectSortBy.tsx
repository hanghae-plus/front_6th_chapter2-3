import { usePostsFilterStore } from '@/shared/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

const SORT_BY_OPTIONS = [
  { value: 'none', label: '없음' },
  { value: 'id', label: 'ID' },
  { value: 'title', label: '제목' },
  { value: 'reactions', label: '반응' },
];

export const SelectSortBy = () => {
  const { sortBy, setSortBy } = usePostsFilterStore();

  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='정렬 기준' />
      </SelectTrigger>
      <SelectContent>
        {SORT_BY_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
