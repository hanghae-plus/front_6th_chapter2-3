import { usePostFilterStore } from '../model/store';
import { Select } from '@/shared/ui/select';

const PostFilterSortBy = () => {
  const { sortBy, setFilter } = usePostFilterStore();
  return (
    <Select
      value={sortBy}
      onValueChange={(value) => setFilter('sortBy', value)}
    >
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="정렬 기준" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="none">없음</Select.Item>
        <Select.Item value="id">ID</Select.Item>
        <Select.Item value="title">제목</Select.Item>
        <Select.Item value="reactions">반응</Select.Item>
      </Select.Content>
    </Select>
  );
};

export default PostFilterSortBy;
