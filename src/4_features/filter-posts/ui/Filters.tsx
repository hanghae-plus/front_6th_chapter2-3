import { SearchInput } from './SearchInput';
import { SelectSortBy } from './SelectSortBy';
import { SelectSortOrder } from './SelectSortOrder';
import { SelectTag } from './SelectTag';

export const Filters = () => {
  return (
    <div className='flex gap-4'>
      <SearchInput />
      <SelectTag />
      <SelectSortBy />
      <SelectSortOrder />
    </div>
  );
};
