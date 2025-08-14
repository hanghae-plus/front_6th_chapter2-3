import { SORT_ORDER } from '@/entities/post';
import { usePostsFilterStore } from '@/shared/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

const SORT_ORDER_OPTIONS: { value: SORT_ORDER; label: string }[] = [
  { value: SORT_ORDER.ASC, label: '오름차순' },
  { value: SORT_ORDER.DESC, label: '내림차순' },
];

export const SelectSortOrder = () => {
  const { sortOrder, setSortOrder } = usePostsFilterStore();

  return (
    <Select value={sortOrder} onValueChange={setSortOrder}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='정렬 순서' />
      </SelectTrigger>
      <SelectContent>
        {SORT_ORDER_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
