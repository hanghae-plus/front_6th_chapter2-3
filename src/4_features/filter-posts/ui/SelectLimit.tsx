import { UI_CONSTANTS } from '@/shared/constants';
import { usePostsFilterStore } from '@/shared/lib';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

export const SelectLimit = () => {
  const { limit, setLimit } = usePostsFilterStore();

  return (
    <Select
      value={limit.toString()}
      onValueChange={value => setLimit(Number(value))}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='10' />
      </SelectTrigger>
      <SelectContent>
        {UI_CONSTANTS.PAGINATION.LIMIT_OPTIONS.map(option => (
          <SelectItem key={option} value={String(option)}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
