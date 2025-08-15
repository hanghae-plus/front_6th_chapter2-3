import { usePostFilterStore } from '../model/store';

import { Select } from '@/shared/ui/select';

const PostFilterSortOrder = () => {
  const { sortOrder, sortBy, setFilter } = usePostFilterStore();
  return (
    <Select
      value={sortOrder}
      onValueChange={(value) => setFilter('sortOrder', value)}
      disabled={sortBy === 'none'}
    >
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="정렬 순서" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="asc">오름차순</Select.Item>
        <Select.Item value="desc">내림차순</Select.Item>
      </Select.Content>
    </Select>
  );
};

export default PostFilterSortOrder;
